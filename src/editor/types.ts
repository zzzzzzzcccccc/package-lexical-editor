import type React from 'react'
import type { LexicalEditor, EditorThemeClasses, Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'
import { EDIT_MODE } from './constants'

export type EditMode = (typeof EDIT_MODE)[keyof typeof EDIT_MODE]

export interface EditorProps {
  namespace: string
  className?: string
  style?: React.CSSProperties
  editorClassName?: string
  editorStyle?: React.CSSProperties
  onError?: (error: Error, editor: LexicalEditor) => void
  placeholder?: React.ReactNode
  editMode?: EditMode
  readOnly?: boolean
  disabled?: boolean
  theme?: EditorThemeClasses
  nodes?: Array<Klass<LexicalNode> | LexicalNodeReplacement>
  debug?: boolean
  autoFocus?: { defaultSelection?: 'rootStart' | 'rootEnd' }
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
}

export type ContentProps = Omit<EditorProps, 'onError' | 'theme' | 'nodes'>
