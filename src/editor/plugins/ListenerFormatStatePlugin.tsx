import { useEffect, useCallback } from 'react'
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode } from '@lexical/rich-text'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { useEditorContext } from '../hooks'
import { getSelectedNode } from '../utils/getSelectedNode'

export function ListenerFormatStatePlugin() {
  const {
    activeEditor,
    updateActiveEditor,
    toggleLink,
    updateBlock,
    updateAlign,
    toggleBold,
    toggleItalic,
    toggleUnderline
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
    }
  }, [activeEditor, toggleBold, toggleItalic, toggleLink, toggleUnderline, updateAlign, updateBlock])

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
      )
    )
  }, [activeEditor, update, updateActiveEditor])

  return null
}
