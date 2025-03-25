import { useEffect, useCallback } from 'react'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR
} from 'lexical'

import { useEditorContext } from '../hooks'
import { CUSTOMER_LEXICAL_COMMAND } from '../constants'
import { InsertVariablePayload } from '../types'
import { $createVariableNode } from '../nodes'
import { getRangeSelectionInfo } from '../utils/getRangeSelectionInfo'

export function VariablePlugin() {
  const { activeEditor } = useEditorContext()

  const handleInsertVariable = useCallback(
    (payload: InsertVariablePayload) => {
      return activeEditor.update(() => {
        const imageNode = $createVariableNode(payload)
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
    mergeRegister(
      activeEditor.registerCommand(
        CUSTOMER_LEXICAL_COMMAND.insertVariable,
        (payload: InsertVariablePayload) => {
          handleInsertVariable(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [activeEditor, handleInsertVariable])

  return null
}
