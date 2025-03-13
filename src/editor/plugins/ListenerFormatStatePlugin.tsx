import { useEffect, useCallback } from 'react'
import { $findMatchingParent, $getNearestNodeOfType, $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode } from '@lexical/rich-text'
import { $getSelectionStyleValueForProperty } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { useEditorContext } from '../hooks'
import { getSelectedNode } from '../utils/getSelectedNode'
import { intialEditorContext } from '../context/EditorContext'
import { InsertImagePayload } from '../types'
import { CUSTOMER_LEXICAL_COMMAND } from '../constants'
import { $createImageNode } from '../nodes'

export function ListenerFormatStatePlugin() {
  const {
    activeEditor,
    updateActiveEditor,
    updateFontColor,
    updateBackgroundColor,
    updateFontSize,
    updateFontFamily,
    toggleLink,
    updateBlock,
    updateAlign,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleLowercase,
    toggleUppercase,
    toggleCapitalize,
    toggleHighlight,
    toggleStrikethrough,
    toggleCode
  } = useEditorContext()

  const update = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const anchorNodeKey = anchorNode.getKey()

      let element =
        anchorNodeKey === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (node) => {
              const parent = node.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element == null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDom = activeEditor.getElementByKey(elementKey)

      const node = getSelectedNode(selection)
      const parent = node.getParent()
      const link = $isLinkNode(parent) || $isLinkNode(node)

      toggleLink(link)

      if (elementDom !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()

          updateBlock(type)
        } else {
          updateBlock(
            $isHeadingNode(element) ? element.getTag() : (element.getType() as Parameters<typeof updateBlock>[0])
          )
        }
      }

      updateFontColor($getSelectionStyleValueForProperty(selection, 'color', intialEditorContext.fontColor))
      updateBackgroundColor(
        $getSelectionStyleValueForProperty(selection, 'background-color', intialEditorContext.backgroundColor)
      )
      updateFontSize($getSelectionStyleValueForProperty(selection, 'font-size', intialEditorContext.fontSize))
      updateFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', intialEditorContext.fontFamily))

      const matchingParent = $isLinkNode(parent)
        ? $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline())
        : null

      const align = $isElementNode(matchingParent)
        ? matchingParent.getFormatType()
        : $isElementNode(node)
        ? node.getFormatType()
        : parent?.getFormatType()

      if (align) {
        updateAlign(align as Parameters<typeof updateAlign>[0])
      }

      toggleBold(selection.hasFormat('bold'))
      toggleItalic(selection.hasFormat('italic'))
      toggleUnderline(selection.hasFormat('underline'))
      toggleLowercase(selection.hasFormat('lowercase'))
      toggleUppercase(selection.hasFormat('uppercase'))
      toggleCapitalize(selection.hasFormat('capitalize'))
      toggleHighlight(selection.hasFormat('highlight'))
      toggleStrikethrough(selection.hasFormat('strikethrough'))
      toggleCode(selection.hasFormat('code'))
    }
  }, [
    activeEditor,
    toggleBold,
    toggleCapitalize,
    toggleCode,
    toggleHighlight,
    toggleItalic,
    toggleLink,
    toggleLowercase,
    toggleStrikethrough,
    toggleUnderline,
    toggleUppercase,
    updateAlign,
    updateBackgroundColor,
    updateBlock,
    updateFontColor,
    updateFontFamily,
    updateFontSize
  ])

  const handleOnInsertImage = useCallback(
    (payload: InsertImagePayload) => {
      return activeEditor.update(() => {
        const imageNode = $createImageNode(payload)
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection)
          const parent = node.getParent()
          const grandpa = parent?.getParent()
          if ($isLinkNode(parent)) {
            if (grandpa) {
              grandpa.append(imageNode)
            }
          } else {
            selection.insertNodes([imageNode])
          }
        } else {
          $insertNodes([imageNode])
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }
        }
      })
    },
    [activeEditor]
  )

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      update()
    })
  }, [activeEditor, update])

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
          updateActiveEditor(editor)
          update()
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand(
        CUSTOMER_LEXICAL_COMMAND.insertImage,
        (payload: InsertImagePayload) => {
          handleOnInsertImage(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [activeEditor, handleOnInsertImage, update, updateActiveEditor])

  return null
}
