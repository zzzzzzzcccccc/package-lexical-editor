import React from 'react'

export interface EditorPlaceholderProps {
  children?: React.ReactNode
}

export function EditorPlaceholder(props: EditorPlaceholderProps) {
  const { children } = props

  if (!children) return

  return <div className='placeholder'>{children}</div>
}
