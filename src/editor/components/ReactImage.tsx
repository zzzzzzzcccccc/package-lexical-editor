import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND
} from 'lexical'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'

import { ImageResizer } from './ImageResizer'
import { LazyImage } from './LazyImage'
import { BrokenImage } from './BrokenImage'
import { useEditorContext } from '../hooks'
import { $isImageNode } from '../nodes'

export interface ReactImageProps {
  src: string
  altText: string
  maxWidth: number
  nodeKey: string
  width: number | 'inherit'
  height: number | 'inherit'
  attributes: string | null
}

export function ReactImage(props: ReactImageProps) {
  const { src, altText, width, height, maxWidth, attributes, nodeKey } = props

  const imageRef = useRef<HTMLImageElement>(null)

  const { activeEditor } = useEditorContext()
  const isEditable = useLexicalEditable()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)

  const [isLoadError, setIsLoadError] = useState(false)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [selection, setSelection] = useState<BaseSelection | null>(null)

  const isNodeSelection = $isNodeSelection(selection)
  const draggable = isSelected && isNodeSelection && !isResizing
  const isFocused = (isSelected || isResizing) && isEditable

  const handleOnLoadImageError = () => {
    setIsLoadError(true)
  }

  const handleOnResizeStart = () => {
    setIsResizing(true)
  }

  const handleOnResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    activeEditor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const handleOnClickCommand = useCallback(
    (event: MouseEvent) => {
      if (isResizing) return true

      if (event.target === imageRef.current) {
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
    [clearSelection, isResizing, isSelected, setSelected]
  )

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        const updatedSelection = editorState.read(() => $getSelection())
        setSelection($isNodeSelection(updatedSelection) ? updatedSelection : null)
      }),
      activeEditor.registerCommand(CLICK_COMMAND, handleOnClickCommand, COMMAND_PRIORITY_LOW),
      activeEditor.registerCommand(
        DRAGSTART_COMMAND,
        (event: DragEvent) => {
          if (event.target === imageRef.current) {
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
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              className={[isFocused ? 'focused' : null, isNodeSelection ? 'draggable' : ''].filter(Boolean).join(' ')}
              src={src}
              imageRef={imageRef}
              altText={altText}
              width={width}
              height={height}
              maxWidth={maxWidth}
              attributes={attributes}
              onError={handleOnLoadImageError}
            />
          )}
        </div>
        {isNodeSelection && isFocused && (
          <ImageResizer
            onResizeEnd={handleOnResizeEnd}
            onResizeStart={handleOnResizeStart}
            editor={activeEditor}
            imageRef={imageRef}
            maxWidth={maxWidth}
          />
        )}
      </>
    </Suspense>
  )
}
