import { useCallback, useState } from 'react'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $setBlocksType } from '@lexical/selection'
import {
  $isListItemNode,
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils'

import { EDIT_MODE, BLOCK, ALIGN } from '../constants'
import { EditorProps } from '../types'
import type { EditorContext } from '../context/EditorContext'
import { sanitizeUrl } from '../utils/url'

export type EditorContextProviderOptions = Pick<EditorProps, 'editMode' | 'disabled' | 'readOnly'>

export function useEditorContextProvider(options: EditorContextProviderOptions): EditorContext {
  const { editMode = EDIT_MODE.richText, readOnly = false, disabled = false } = options

  const [editor] = useLexicalComposerContext()

  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [activeEditor, setActiveEditor] = useState(editor)
  const [link, setLink] = useState(false)
  const [block, setBlock] = useState<EditorContext['block']>('paragraph')
  const [align, setAlign] = useState<EditorContext['align']>(ALIGN.left)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [editLink, setEditLink] = useState(false)

  const enableRichText = editMode === EDIT_MODE.richText
  const enableText = editMode === EDIT_MODE.text

  const onAnchor = useCallback(
    (element: HTMLElement | null) => {
      if (element && !anchor) {
        setAnchor(element)
      }
    },
    [anchor]
  )

  const updateActiveEditor = useCallback((editor: LexicalEditor) => {
    setActiveEditor(editor)
  }, [])

  const updateBlock = useCallback((target: keyof typeof BLOCK) => {
    if (!Object.keys(BLOCK).includes(target)) {
      console.warn(`Failed to update block reson: Invalid block type: ${target}`)
      return false
    }
    setBlock(target)
    return true
  }, [])

  const updateAlign = useCallback((target: (typeof ALIGN)[keyof typeof ALIGN]) => {
    if (!Object.values(ALIGN).includes(target)) {
      console.warn(`Failed to update align reson: Invalid align type: ${target}`)
      return false
    }
    setAlign(target)
    return true
  }, [])

  const toggleLink = useCallback((target?: boolean) => {
    setLink((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleBold = useCallback((target?: boolean) => {
    setBold((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleItalic = useCallback((target?: boolean) => {
    setItalic((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleUnderline = useCallback((target?: boolean) => {
    setUnderline((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleEditLink = useCallback((target?: boolean) => {
    setEditLink((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const formatBlock = useCallback(
    (target: keyof typeof BLOCK) => {
      const foramtParagraph = () => {
        activeEditor.update(() => {
          const selection = $getSelection()
          $setBlocksType(selection, () => $createParagraphNode())
        })
      }

      if (target === 'paragraph') {
        foramtParagraph()

        return
      }

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(target) && block !== target) {
        activeEditor.update(() => {
          const selection = $getSelection()
          $setBlocksType(selection, () => $createHeadingNode(target as HeadingTagType))
        })

        return
      }

      if (target === 'bullet') {
        if (block === 'bullet') {
          foramtParagraph()
        } else {
          activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }

        return
      }

      if (target === 'number') {
        if (block === 'number') {
          foramtParagraph()
        } else {
          activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        return
      }

      if (target === 'check') {
        if (block === 'check') {
          foramtParagraph()
        } else {
          activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        }

        return
      }

      if (target === 'quote') {
        if (block !== 'quote') {
          activeEditor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createQuoteNode())
          })
        }

        return
      }

      console.warn(`Failed to format block reson: Invalid block type: ${target}`)
    },
    [activeEditor, block]
  )

  const formatAlign = useCallback(
    (target: (typeof ALIGN)[keyof typeof ALIGN]) => {
      if (!Object.values(ALIGN).includes(target)) {
        console.warn(`Failed to format align reson: Invalid align type: ${target}`)
        return
      }

      activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, target)
    },
    [activeEditor]
  )

  const formatLink = useCallback(() => {
    if (!link) {
      toggleEditLink(true)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      toggleEditLink(false)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [activeEditor, link, toggleEditLink])

  const formatBold = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  }, [activeEditor])

  const formatItalic = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  }, [activeEditor])

  const formatUnderline = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
  }, [activeEditor])

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        toggleEditLink(false)
        toggleLink(false)

        const anchor = selection.anchor
        const focus = selection.focus
        const nodes = selection.getNodes()
        const extractedNodes = selection.extract()

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0]
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode
            }

            if (textNode.__style !== '') {
              textNode.setStyle('')
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0)
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('')
            }
            node = textNode
          } else if ($isHeadingNode(node) || $isQuoteNode(node) || $isListNode(node) || $isListItemNode(node)) {
            node.replace($createParagraphNode(), true)
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [activeEditor, toggleEditLink, toggleLink])

  return {
    anchor,
    editor,
    activeEditor,
    link,
    block,
    align,
    bold,
    italic,
    underline,
    enableRichText,
    enableText,
    readOnly,
    disabled,
    editLink,
    onAnchor,
    updateActiveEditor,
    updateBlock,
    updateAlign,
    toggleLink,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleEditLink,
    formatBlock,
    formatAlign,
    formatLink,
    formatBold,
    formatItalic,
    formatUnderline,
    clearFormatting
  }
}
