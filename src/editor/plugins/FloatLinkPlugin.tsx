import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { createPortal } from 'react-dom'

import {
  $getSelection,
  $isRangeSelection,
  $isLineBreakNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  KEY_SPACE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  getDOMSelection,
  BaseSelection
} from 'lexical'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import { $createLinkNode, $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'

import { getSelectedNode } from '../utils/getSelectedNode'
import { setFloatingElemPositionForLinkEditor } from '../utils/setFloatingElemPositionForLinkEditor'
import { useEditorContext } from '../hooks'
import { sanitizeUrl } from '../utils/url'

export interface FloatLinkPluginProps {
  anchor: HTMLElement
}

export interface FloatLinkEditorProps {
  editLink: boolean
  editor: LexicalEditor
  anchor: HTMLElement
  enabled: boolean
  onCancel: () => void
  toggleEditLink: (target?: boolean) => void
}

export interface FloatLinkViewProps {
  url: string
  onEdit?: () => void
}

export interface FloatLinkUpdateProps {
  value: string
  onChange?: (value: string) => void
  onSave?: () => void
  onCancel?: () => void
}

const FloatLinkUpdate = forwardRef<HTMLInputElement, FloatLinkUpdateProps>((props, ref) => {
  const { value, onChange, onSave, onCancel } = props

  const isComposing = useRef(false)

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value)
  }

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing.current) return false

    if (event.key === 'Enter') {
      event.preventDefault()
      onSave?.()
      return true
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel?.()
      return true
    }

    return false
  }

  const handleOnCompositionStart = () => {
    isComposing.current = true
  }

  const handleOnCompositionEnd = () => {
    isComposing.current = false
  }

  const handleOnSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onSave?.()
  }

  const handleOnCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onCancel?.()
  }

  return (
    <>
      <input
        ref={ref}
        onCompositionStart={handleOnCompositionStart}
        onCompositionEnd={handleOnCompositionEnd}
        className='link-input'
        value={value}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
      />
      <div>
        <button type='button' className='link-cancel' onClick={handleOnCancel} />
        <button type='button' className='link-confirm' onClick={handleOnSave} />
      </div>
    </>
  )
})

function FloatLinkView(props: FloatLinkViewProps) {
  const { url, onEdit } = props

  const handleOnEditLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onEdit?.()
  }

  return (
    <div className='link-view'>
      <a href={sanitizeUrl(url)} target='_blank' rel='noopener noreferrer'>
        {url}
      </a>
      <button className='link-edit' type='button' onClick={handleOnEditLinkClick} />
    </div>
  )
}

function FloatLinkEditor(props: FloatLinkEditorProps) {
  const { editor, anchor, enabled, editLink, toggleEditLink, onCancel } = props

  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [url, setUrl] = useState('')
  const [editUrl, setEditUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  const update = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      if (linkParent) {
        setUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setUrl(node.getURL())
      } else {
        setUrl('')
      }

      if (editLink) {
        setEditUrl(url)
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = getDOMSelection(editor._window)
    const activeElement = document.activeElement

    if (editorElem === null) {
      return false
    }

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined = nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        domRect.y += 40
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchor)
      }
      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchor)
      }
      setLastSelection(null)
      toggleEditLink(false)
      setUrl('')
    }

    return true
  }, [editor, editLink, url, anchor, toggleEditLink])

  const editorWithUpdate = useCallback(() => {
    editor.getEditorState().read(() => {
      update()
    })
  }, [editor, update])

  const handleOnEdit = () => {
    setEditUrl(url)
    toggleEditLink(true)
  }

  const handleOnChange = (value: string) => {
    setEditUrl(value)
  }

  const handleOnSave = () => {
    if (lastSelection !== null && editUrl?.trim()) {
      if (url !== '') {
        editor.update(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editUrl))
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent()
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title
              })
              parent.replace(linkNode, true)
            }
          }
        })
      }
      setEditUrl('https://')
      toggleEditLink(false)
    }
  }

  const handleOnCancel = () => {
    toggleEditLink(false)
  }

  useEffect(() => {
    window.addEventListener('resize', editorWithUpdate)
    anchor.addEventListener('scroll', editorWithUpdate)

    return () => {
      window.removeEventListener('resize', editorWithUpdate)
      anchor.removeEventListener('scroll', editorWithUpdate)
    }
  }, [anchor, editor, editorWithUpdate])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          update()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          update()
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_SPACE_COMMAND,
        () => {
          if (enabled) {
            onCancel()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, enabled, onCancel, update])

  useEffect(() => {
    editorWithUpdate()
  }, [editorWithUpdate])

  useEffect(() => {
    if (editLink && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editLink])

  return (
    <div className='link-editor' ref={editorRef}>
      {!enabled ? null : editLink ? (
        <FloatLinkUpdate
          value={editUrl}
          onChange={handleOnChange}
          onSave={handleOnSave}
          onCancel={handleOnCancel}
          ref={inputRef}
        />
      ) : (
        <FloatLinkView url={url} onEdit={handleOnEdit} />
      )}
    </div>
  )
}

export function FloatLinkPlugin(props: FloatLinkPluginProps) {
  const { anchor } = props
  const { editLink, toggleEditLink, activeEditor, updateActiveEditor } = useEditorContext()

  const [enabled, setEnabled] = useState(false)

  const update = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const focusNode = getSelectedNode(selection)
      const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
      const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode)

      if (!(focusLinkNode || focusAutoLinkNode)) {
        setEnabled(false)
        return
      }

      const badNode = selection
        .getNodes()
        .filter((node) => !$isLineBreakNode(node))
        .find((node) => {
          const linkNode = $findMatchingParent(node, $isLinkNode)
          const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)

          return (
            (focusLinkNode && !focusLinkNode.is(linkNode)) ||
            (linkNode && !linkNode.is(focusLinkNode)) ||
            (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
            (autoLinkNode && (!autoLinkNode.is(focusAutoLinkNode) || autoLinkNode.getIsUnlinked()))
          )
        })

      setEnabled(Boolean(!badNode))
    }
  }, [])

  const handleOnCancel = () => {
    setEnabled(false)
  }

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          update()
        })
      }),
      activeEditor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, editor) => {
          update()
          updateActiveEditor(editor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')

              return true
            }
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [activeEditor, update, updateActiveEditor])

  return createPortal(
    <FloatLinkEditor
      editLink={editLink}
      toggleEditLink={toggleEditLink}
      onCancel={handleOnCancel}
      anchor={anchor}
      editor={activeEditor}
      enabled={enabled}
    />,
    anchor
  )
}
