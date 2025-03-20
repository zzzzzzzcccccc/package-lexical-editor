import React from 'react'

export interface EditorPlaceholderProps {
  children?: React.ReactNode
}

export function EditorPlaceholder(props: EditorPlaceholderProps) {
  const { children } = props

  if (!children) return null

  return <div className='placeholder'>{children}</div>
}
