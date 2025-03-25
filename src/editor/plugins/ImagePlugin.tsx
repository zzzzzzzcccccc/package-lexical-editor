import { useEffect, useCallback } from 'react'
import { useEditorContext } from '../hooks'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { $getSelection, $insertNodes, $isRangeSelection, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR } from 'lexical'

import { CUSTOMER_LEXICAL_COMMAND } from '../constants'
import { InsertImagePayload } from '../types'
import { $createImageNode, $createParagraphNode } from '../nodes'
import { getRangeSelectionInfo } from '../utils/getRangeSelectionInfo'

export function ImagePlugin() {
  const { activeEditor } = useEditorContext()

  const handleOnInsertImage = useCallback(
    (payload: InsertImagePayload) => {
      return activeEditor.update(() => {
        const imageNode = $createImageNode(payload)
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          const { grandpa, isLinkNode } = getRangeSelectionInfo(selection)
          if (isLinkNode) {
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
    return mergeRegister(
      activeEditor.registerCommand(
        CUSTOMER_LEXICAL_COMMAND.insertImage,
        (payload: InsertImagePayload) => {
          handleOnInsertImage(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [activeEditor, handleOnInsertImage])

  return null
}
