import React, { useRef } from 'react'
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin'

export interface DraggableBlockPluginProps {
  anchor: HTMLElement
}

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest('.draggable-block-menu')
}

export function DraggableBlockPlugin(props: DraggableBlockPluginProps) {
  const { anchor } = props

  const menuRef = useRef<HTMLDivElement>(null)
  const targetLineRef = useRef<HTMLDivElement>(null)

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchor}
      menuRef={menuRef as React.RefObject<HTMLElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLElement>}
      menuComponent={
        <div ref={menuRef} className='icon draggable-block-menu'>
          <div className='icon' />
        </div>
      }
      targetLineComponent={<div ref={targetLineRef} className='draggable-block-target-line' />}
      isOnMenu={isOnMenu}
    />
  )
}
