import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { useEffect, useCallback } from 'react'
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
import { InsertMediaPayload } from '../types'
import { $createMediaNode } from '../nodes'
import { getRangeSelectionInfo } from '../utils/getRangeSelectionInfo'

export function MediaPlugin() {
  const { activeEditor } = useEditorContext()

  const handleOnInsertMedia = useCallback(
    (payload: InsertMediaPayload) => {
      return activeEditor.update(() => {
        const mediaNode = $createMediaNode(payload)
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const { grandpa, isLinkNode } = getRangeSelectionInfo(selection)
          if (isLinkNode) {
            if (grandpa) {
              grandpa.append(mediaNode)
            }
          } else {
            selection.insertNodes([mediaNode])
          }
        } else {
          $insertNodes([mediaNode])
          if ($isRootOrShadowRoot(mediaNode.getParentOrThrow())) {
            $wrapNodeInElement(mediaNode, $createParagraphNode).selectEnd()
          }
        }
      })
    },
    [activeEditor]
  )

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerCommand(
        CUSTOMER_LEXICAL_COMMAND.insertMedia,
        (payload: InsertMediaPayload) => {
          handleOnInsertMedia(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [activeEditor, handleOnInsertMedia])

  return null
}
