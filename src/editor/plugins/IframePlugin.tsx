import { useEffect, useCallback } from 'react'
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR } from 'lexical'

import { useEditorContext } from '../hooks'
import { $createIframeNode } from '../nodes'
import { InsertIframePayload } from '../types'
import { CUSTOMER_LEXICAL_COMMAND } from '../constants'

export function IframePlugin() {
  const { activeEditor } = useEditorContext()

  const handleOnInsertIframe = useCallback((payload: InsertIframePayload) => {
    const iframeNode = $createIframeNode(payload)

    $insertNodeToNearestRoot(iframeNode)

    return true
  }, [])

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerCommand(
        CUSTOMER_LEXICAL_COMMAND.insertIframe,
        (payload: InsertIframePayload) => {
          handleOnInsertIframe(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [activeEditor, handleOnInsertIframe])

  return null
}
