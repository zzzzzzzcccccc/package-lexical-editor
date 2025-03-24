import { useEffect, useCallback } from 'react'
import { useEditorContext } from '../hooks'
import { mergeRegister } from '@lexical/utils'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { COMMAND_PRIORITY_LOW } from 'lexical'

export interface DragDropPasteFilesPluginProps {
  onDragDropPasteFiles?: (target: Array<File>) => boolean
}

export function DragDropPasteFilesPlugin({ onDragDropPasteFiles }: DragDropPasteFilesPluginProps) {
  const { activeEditor } = useEditorContext()

  const handleDragDropPasteFiles = useCallback(
    (target: Array<File>) => {
      return onDragDropPasteFiles ? onDragDropPasteFiles(target) : false
    },
    [onDragDropPasteFiles]
  )

  useEffect(() => {
    return mergeRegister(activeEditor.registerCommand(DRAG_DROP_PASTE, handleDragDropPasteFiles, COMMAND_PRIORITY_LOW))
  }, [activeEditor, handleDragDropPasteFiles])

  return null
}
