import { useRef, useCallback, useEffect } from 'react'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, DRAGSTART_COMMAND } from 'lexical'

import { useEditorContext } from '../hooks'

export interface ReactIframeProps {
  src: string
  height: string
  elementAllow: string
  nodeKey: string
}

export function ReactIframe(props: ReactIframeProps) {
  const { src, height, elementAllow, nodeKey } = props

  const nodeRef = useRef<HTMLIFrameElement>(null)

  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const isEditable = useLexicalEditable()
  const { activeEditor } = useEditorContext()

  const focused = isSelected && isEditable

  const handleOnClickCommand = useCallback(
    (event: MouseEvent) => {
      if (event.target === nodeRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected)
        } else {
          clearSelection()
          setSelected(true)
        }
        return true
      }

      return false
    },
    [clearSelection, isSelected, setSelected]
  )

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerCommand(CLICK_COMMAND, handleOnClickCommand, COMMAND_PRIORITY_LOW),
      activeEditor.registerCommand(
        DRAGSTART_COMMAND,
        (event: DragEvent) => {
          if (event.target === nodeRef.current) {
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [activeEditor, handleOnClickCommand])

  return (
    <iframe
      ref={nodeRef}
      className={['editor-iframe', focused ? 'editor-iframe-focused' : ''].join(' ')}
      width='100%'
      height={height}
      src={src}
      allow={elementAllow}
      draggable={false}
    />
  )
}
