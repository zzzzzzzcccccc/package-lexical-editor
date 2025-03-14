import type React from 'react'
import type { LexicalEditor, EditorThemeClasses, SerializedEditorState, BaseSelection } from 'lexical'

import { EDIT_MODE, VALUE_SOURCE, MEDIA_NODE_TYPE } from './constants'
import type { EditorContext } from './context/EditorContext'

export type EditMode = (typeof EDIT_MODE)[keyof typeof EDIT_MODE]
export type ValueSource = (typeof VALUE_SOURCE)[keyof typeof VALUE_SOURCE]
export type MediaNodeType = (typeof MEDIA_NODE_TYPE)[keyof typeof MEDIA_NODE_TYPE]
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
export type InsertMediaPayload = {
  src: string
  mediaType: MediaNodeType
  width?: string
  height?: string
  attributes?: string | null
}
export type InsertIframePayload = {
  src: string
  height: string
  elementAllow?: string
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
  | 'updateValue'
  | 'insertValue'
  | 'insertImage'
  | 'insertMedia'
  | 'insertIframe'
  | 'clearValue'
  | 'focus'
  | 'blur'
  | 'undo'
  | 'redo'
>

export type ContentProps = Omit<
  EditorProps,
  'onError' | 'theme' | 'nodes' | 'namespace' | 'editMode' | 'readOnly' | 'disabled'
>
