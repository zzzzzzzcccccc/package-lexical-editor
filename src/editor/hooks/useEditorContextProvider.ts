import { useCallback, useState, useEffect } from 'react'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  UNDO_COMMAND,
  type LexicalEditor
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $patchStyleText, $setBlocksType } from '@lexical/selection'
import {
  $isListItemNode,
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils'

import { EDIT_MODE, BLOCK, ALIGN, VALUE_SOURCE, CUSTOMER_LEXICAL_COMMAND } from '../constants'
import type {
  EditorFocusOptions,
  EditorProps,
  InsertIframePayload,
  InsertImagePayload,
  InsertMediaPayload,
  ValueSource
} from '../types'
import { intialEditorContext, type EditorContext } from '../context/EditorContext'
import { sanitizeUrl } from '../utils/url'
import { filterDomFromString } from '../utils/dom'
import { getSelectedNode } from '../utils/getSelectedNode'

export type EditorContextProviderOptions = Pick<EditorProps, 'editMode' | 'disabled' | 'readOnly'>

export function useEditorContextProvider(options: EditorContextProviderOptions): EditorContext {
  const { editMode = EDIT_MODE.richText, readOnly = false, disabled = false } = options

  const [editor] = useLexicalComposerContext()

  const [anchor, setAnchor] = useState<HTMLElement | null>(intialEditorContext.anchor)
  const [activeEditor, setActiveEditor] = useState(editor)

  const [canRedo, setCanRedo] = useState(intialEditorContext.canRedo)
  const [canUndo, setCanUndo] = useState(intialEditorContext.canUndo)
  const [fontColor, setFontColor] = useState(intialEditorContext.fontColor)
  const [backgroundColor, setBackgroundColor] = useState(intialEditorContext.backgroundColor)
  const [fontSize, setFontSize] = useState(intialEditorContext.fontSize)
  const [fontFamily, setFontFamily] = useState(intialEditorContext.fontFamily)
  const [link, setLink] = useState(intialEditorContext.link)
  const [block, setBlock] = useState<EditorContext['block']>(intialEditorContext.block)
  const [align, setAlign] = useState<EditorContext['align']>(intialEditorContext.align)
  const [bold, setBold] = useState(intialEditorContext.bold)
  const [italic, setItalic] = useState(intialEditorContext.italic)
  const [underline, setUnderline] = useState(intialEditorContext.underline)
  const [lowercase, setLowercase] = useState(intialEditorContext.lowercase)
  const [uppercase, setUppercase] = useState(intialEditorContext.uppercase)
  const [capitalize, setCapitalize] = useState(intialEditorContext.capitalize)
  const [highlight, setHighlight] = useState(intialEditorContext.highlight)
  const [strikethrough, setStrikethrough] = useState(intialEditorContext.strikethrough)
  const [code, setCode] = useState(intialEditorContext.code)

  const [contentLength, setContentLength] = useState(intialEditorContext.contentLength)
  const [empty, setEmpty] = useState(intialEditorContext.empty)
  const [editLink, setEditLink] = useState(intialEditorContext.editLink)

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

  const updateFontColor = useCallback((target: string) => {
    setFontColor(target)
  }, [])

  const updateBackgroundColor = useCallback((target: string) => {
    setBackgroundColor(target)
  }, [])

  const updateFontSize = useCallback((target: string) => {
    setFontSize(target)
  }, [])

  const updateFontFamily = useCallback((target: string) => {
    setFontFamily(target)
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

  const toggleCanRedo = useCallback((target?: boolean) => {
    setCanRedo((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleCanUndo = useCallback((target?: boolean) => {
    setCanUndo((prev) => (typeof target === 'boolean' ? target : !prev))
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

  const toggleLowercase = useCallback((target?: boolean) => {
    setLowercase((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleUppercase = useCallback((target?: boolean) => {
    setUppercase((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleCapitalize = useCallback((target?: boolean) => {
    setCapitalize((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleHighlight = useCallback((target?: boolean) => {
    setHighlight((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleStrikethrough = useCallback((target?: boolean) => {
    setStrikethrough((prev) => (typeof target === 'boolean' ? target : !prev))
  }, [])

  const toggleCode = useCallback((target?: boolean) => {
    setCode((prev) => (typeof target === 'boolean' ? target : !prev))
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
          console.log('run check list')
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

  const formatFontColor = useCallback(
    (target: string) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { color: target })
        }
      })
    },
    [activeEditor]
  )

  const formatBackgroundColor = useCallback(
    (target: string) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { 'background-color': target })
        }
      })
    },
    [activeEditor]
  )

  const formatFontSize = useCallback(
    (target: string) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { 'font-size': target })
        }
      })
    },
    [activeEditor]
  )

  const formatFontFamily = useCallback(
    (target: string) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { 'font-family': target })
        }
      })
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

  const formatLowercase = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')
  }, [activeEditor])

  const formatUppercase = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')
  }, [activeEditor])

  const formatCapitalize = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')
  }, [activeEditor])

  const formatHighlight = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
  }, [activeEditor])

  const formatStrikethrough = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
  }, [activeEditor])

  const formatCode = useCallback(() => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
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

  const updateValue = useCallback(
    (value: string, source: ValueSource | 'text') => {
      activeEditor.update(() => {
        const root = $getRoot()
        root.clear()

        if (source === VALUE_SOURCE.html) {
          const dom = filterDomFromString(value as string)
          const nodes = $generateNodesFromDOM(activeEditor, dom)
          root.select()
          $insertNodes(nodes)
        } else if (source === VALUE_SOURCE.json) {
          const state = activeEditor.parseEditorState(value)
          activeEditor.setEditorState(state)
        } else {
          const paragraphNode = $createParagraphNode()
          const textNode = $createTextNode(value)
          paragraphNode.append(textNode)
          root.select()
          $insertNodes([paragraphNode])
        }
      })
    },
    [activeEditor]
  )

  const insertValue = useCallback(
    (value: string, source: ValueSource | 'text') => {
      activeEditor.update(() => {
        let nodes: LexicalNode[] = []

        if (source === VALUE_SOURCE.html) {
          const dom = filterDomFromString(value as string)
          nodes = $generateNodesFromDOM(activeEditor, dom)
        } else if (source === VALUE_SOURCE.json) {
          const state = activeEditor.parseEditorState(value)
          const html = state.read(() => $generateHtmlFromNodes(activeEditor))
          const dom = filterDomFromString(html as string)
          nodes = $generateNodesFromDOM(activeEditor, dom)
        } else {
          nodes = [$createTextNode(value)]
        }

        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection)
          const parent = node.getParent()
          const grandpa = parent?.getParent()
          if ($isLinkNode(parent)) {
            if (grandpa) {
              nodes.forEach((node) => {
                grandpa.append(node)
              })
            }
          } else {
            selection.insertNodes(nodes)
          }
        } else {
          $insertNodes(nodes)
        }
      })
    },
    [activeEditor]
  )

  const insertImage = useCallback(
    (payload: InsertImagePayload) => {
      activeEditor.dispatchCommand(CUSTOMER_LEXICAL_COMMAND.insertImage, payload)
    },
    [activeEditor]
  )

  const insertMedia = useCallback(
    (payload: InsertMediaPayload) => {
      activeEditor.dispatchCommand(CUSTOMER_LEXICAL_COMMAND.insertMedia, payload)
    },
    [activeEditor]
  )

  const insertIframe = useCallback(
    (payload: InsertIframePayload) => {
      activeEditor.dispatchCommand(CUSTOMER_LEXICAL_COMMAND.insertIframe, payload)
    },
    [activeEditor]
  )

  const clearValue = useCallback(() => {
    activeEditor.update(() => {
      const root = $getRoot()
      root.clear()
    })
  }, [activeEditor])

  const updateContentLength = useCallback((length: number) => {
    setContentLength(length)
  }, [])

  const updateEmpty = useCallback((target: boolean) => {
    setEmpty(target)
  }, [])

  const focus = useCallback(
    (callbackFn?: () => void, options?: EditorFocusOptions) => {
      activeEditor.focus(callbackFn, options)
    },
    [activeEditor]
  )

  const blur = useCallback(() => {
    activeEditor.blur()
  }, [activeEditor])

  const redo = useCallback(() => {
    activeEditor.dispatchCommand(REDO_COMMAND, undefined)
  }, [activeEditor])

  const undo = useCallback(() => {
    activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
  }, [activeEditor])

  useEffect(() => {
    if (readOnly || disabled) {
      toggleEditLink(false)
    }
    activeEditor.setEditable(!readOnly && !disabled)
  }, [readOnly, disabled, toggleEditLink, activeEditor])

  return {
    _injected: true,
    anchor,
    editor,
    activeEditor,
    canRedo,
    canUndo,
    fontColor,
    backgroundColor,
    fontFamily,
    fontSize,
    link,
    block,
    align,
    bold,
    italic,
    underline,
    lowercase,
    uppercase,
    capitalize,
    highlight,
    strikethrough,
    code,
    enableRichText,
    enableText,
    readOnly,
    disabled,
    editLink,
    contentLength,
    empty,
    onAnchor,
    updateActiveEditor,
    updateFontColor,
    updateBackgroundColor,
    updateFontSize,
    updateFontFamily,
    updateBlock,
    updateAlign,
    toggleCanRedo,
    toggleCanUndo,
    toggleLink,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleLowercase,
    toggleUppercase,
    toggleCapitalize,
    toggleHighlight,
    toggleStrikethrough,
    toggleCode,
    toggleEditLink,
    formatBlock,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontSize,
    formatFontFamily,
    formatLink,
    formatBold,
    formatItalic,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatHighlight,
    formatStrikethrough,
    formatCode,
    clearFormatting,
    updateValue,
    insertValue,
    insertImage,
    insertMedia,
    insertIframe,
    clearValue,
    updateContentLength,
    updateEmpty,
    focus,
    blur,
    redo,
    undo
  }
}
