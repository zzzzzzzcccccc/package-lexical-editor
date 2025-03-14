import { useEffect, useRef, useCallback } from 'react'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

import type { MediaNodeType } from '../types'
import { MEDIA_NODE_TYPE } from '../constants'
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, DRAGSTART_COMMAND } from 'lexical'
import { useEditorContext } from '../hooks'

export interface ReactMediaProps {
  src: string
  mediaType: MediaNodeType
  nodeKey: string
  width?: string
  height?: string
  attributes: string | null
}

const convertVideoUrl = (url: string): string => {
  if (url.startsWith('blob:')) {
    return url
  } else {
    return `${url}#t=0.001`
  }
}

function Video(
  props: Pick<ReactMediaProps, 'src' | 'width' | 'height' | 'attributes'> & {
    nodeRef: { current: null | HTMLMediaElement }
    focused: boolean
  }
) {
  return (
    <video
      ref={props.nodeRef as { current: null | HTMLVideoElement }}
      className={props.focused ? 'focused' : ''}
      controls
      src={convertVideoUrl(props.src)}
      style={{ width: props.width, height: props.height }}
      customer-attributes={props.attributes}
      playsInline
      draggable={false}
    />
  )
}

function Audio(
  props: Pick<ReactMediaProps, 'src' | 'width' | 'height' | 'attributes'> & {
    nodeRef: { current: null | HTMLMediaElement }
    focused: boolean
  }
) {
  return (
    <audio
      className={props.focused ? 'focused' : ''}
      ref={props.nodeRef}
      controls
      src={props.src}
      style={{ width: props.width, height: props.height }}
      customer-attributes={props.attributes}
      playsInline
      draggable={false}
    />
  )
}

export function ReactMedia(props: ReactMediaProps) {
  const { nodeKey, src, mediaType, width, height, attributes = '' } = props

  const nodeRef = useRef<HTMLMediaElement>(null)

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
    <>
      {mediaType === MEDIA_NODE_TYPE.video ? (
        <Video nodeRef={nodeRef} focused={focused} src={src} width={width} height={height} attributes={attributes} />
      ) : (
        <Audio nodeRef={nodeRef} focused={focused} src={src} width={width} height={height} attributes={attributes} />
      )}
    </>
  )
}
