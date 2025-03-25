import { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { useEditorContext } from '../hooks'
import { getDOMRangeRect } from '../utils/getDOMRangeRect'
import { setFloatingElemPosition } from '../utils/setFloatingElemPosition'
import { mergeRegister } from '@lexical/utils'
import { getSelectedNode } from '../utils/getSelectedNode'

export interface FloatMenuPluginProps {
  anchor: HTMLElement
  children: React.ReactNode
}

function MenuContainer(props: FloatMenuPluginProps) {
  const { anchor, children } = props
  const { activeEditor, link } = useEditorContext()

  const popupCharStylesEditorRef = useRef<HTMLDivElement>(null)

  const handleOnMouseMove = useCallback((e: MouseEvent) => {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX
        const y = e.clientY
        const elementUnderMouse = document.elementFromPoint(x, y)

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none'
        }
      }
    }
  }, [])

  const handleOnMouseUp = useCallback(() => {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto'
      }
    }
  }, [])

  const updatePopupPosition = useCallback(() => {
    const selection = $getSelection()

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current
    const nativeSelection = getDOMSelection(activeEditor._window)

    if (popupCharStylesEditorElem === null) {
      return
    }

    const rootElement = activeEditor.getRootElement()

    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement)

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchor, link)
    }
  }, [activeEditor, anchor, link])

  useEffect(() => {
    const el = popupCharStylesEditorRef.current

    if (el) {
      document.addEventListener('mousemove', handleOnMouseMove)
      document.addEventListener('mouseup', handleOnMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleOnMouseMove)
        document.removeEventListener('mouseup', handleOnMouseUp)
      }
    }
  }, [handleOnMouseMove, handleOnMouseUp])

  useEffect(() => {
    const scrollerElem = anchor.parentElement

    const update = () => {
      activeEditor.getEditorState().read(() => {
        updatePopupPosition()
      })
    }

    window.addEventListener('resize', update)

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [activeEditor, anchor, updatePopupPosition])

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      updatePopupPosition()
    })

    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updatePopupPosition()
        })
      }),
      activeEditor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updatePopupPosition()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [activeEditor, updatePopupPosition])

  return (
    <div className='lexical-float-menu-popup' ref={popupCharStylesEditorRef}>
      {children}
    </div>
  )
}

export function FloatMenuPlugin(props: FloatMenuPluginProps) {
  const { anchor, children } = props
  const { activeEditor } = useEditorContext()

  const [isText, setIsText] = useState(false)

  const update = useCallback(() => {
    activeEditor.getEditorState().read(() => {
      if (activeEditor.isComposing()) {
        return
      }

      const selection = $getSelection()
      const nativeSelection = getDOMSelection(activeEditor._window)
      const rootElement = activeEditor.getRootElement()

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) || rootElement === null || !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false)
        return
      }

      if (!$isRangeSelection(selection)) {
        return
      }

      const node = getSelectedNode(selection)

      if (selection.getTextContent() !== '') {
        setIsText($isTextNode(node) || $isParagraphNode(node))
      } else {
        setIsText(false)
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '')
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false)
      }
    })
  }, [activeEditor])

  useEffect(() => {
    document.addEventListener('selectionchange', update)
    return () => {
      document.removeEventListener('selectionchange', update)
    }
  }, [update])

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(() => {
        update()
      }),
      activeEditor.registerRootListener(() => {
        if (activeEditor.getRootElement() === null) {
          setIsText(false)
        }
      })
    )
  }, [activeEditor, update])

  if (!isText) return null

  return createPortal(<MenuContainer anchor={anchor}>{children}</MenuContainer>, anchor)
}
