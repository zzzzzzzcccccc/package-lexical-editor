import type React from 'react'
import type {
  LexicalEditor,
  EditorThemeClasses,
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  SerializedEditorState,
  BaseSelection
} from 'lexical'

import { EDIT_MODE, VALUE_SOURCE } from './constants'
import type { EditorContext } from './context/EditorContext'

export type EditMode = (typeof EDIT_MODE)[keyof typeof EDIT_MODE]
export type ValueSource = (typeof VALUE_SOURCE)[keyof typeof VALUE_SOURCE]
export type EditorOnChangePayload = {
  value: SerializedEditorState | string
  contentSize: number
  empty: boolean
  selection: BaseSelection | null
  isRangeSelection: boolean
}
export type EditorFocusOptions = { defaultSelection?: 'rootStart' | 'rootEnd' }
export type InsertImagePayload = {
  src: string
  altText: string
  maxWidth?: number
  width?: number
  height?: number
  attributes?: string | null
}

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
  autoFocus?: EditorFocusOptions
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
  ignoreSelectionChange?: boolean
  outputValueSource?: ValueSource
  onChange?: (payload: EditorOnChangePayload) => void
  maxLength?: number
  enableMarkdownShortcut?: boolean
  enableDraggableBlock?: boolean
  modalAnchor?: HTMLElement
}

export type EditorRef = Pick<
  EditorContext,
  'updateValue' | 'insertValue' | 'insertImage' | 'clearValue' | 'focus' | 'blur'
>

export type ContentProps = Omit<
  EditorProps,
  'onError' | 'theme' | 'nodes' | 'namespace' | 'editMode' | 'readOnly' | 'disabled'
>
