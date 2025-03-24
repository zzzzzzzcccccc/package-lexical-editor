import { useEffect, useCallback } from 'react'
import { mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical'

import { useEditorContext } from '../hooks'

export type PastePluginProps = {
  onPaste?: (event: ClipboardEvent) => boolean
}

export function PastePlugin({ onPaste }: PastePluginProps) {
  const { activeEditor } = useEditorContext()

  const emitPasteEvent = useCallback((event: ClipboardEvent) => (onPaste ? onPaste(event) : false), [onPaste])

  const handleOnPaste = useCallback(
    (event: ClipboardEvent | InputEvent | KeyboardEvent) => {
      if (!(event instanceof ClipboardEvent) || !event.clipboardData) {
        return false
      }
      return emitPasteEvent(event)
    },
    [emitPasteEvent]
  )

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          return handleOnPaste(event)
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [activeEditor, handleOnPaste])

  return null
}
