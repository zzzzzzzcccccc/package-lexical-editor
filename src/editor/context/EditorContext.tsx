import React, { createContext } from 'react'
import type { LexicalEditor } from 'lexical'
import { useEditorContextProvider, type EditorContextProviderOptions } from '../hooks'
import { BLOCK, ALIGN } from '../constants'
import type {
  EditorFocusOptions,
  InsertIframePayload,
  InsertImagePayload,
  InsertMediaPayload,
  ValueSource
} from '../types'

export interface EditorContext {
  _injected: boolean
  anchor: HTMLElement | null
  editor: LexicalEditor
  activeEditor: LexicalEditor
  canRedo: boolean
  canUndo: boolean
  fontFamily: string
  fontSize: string
  fontColor: string
  backgroundColor: string
  link: boolean
  block: keyof typeof BLOCK
  align: (typeof ALIGN)[keyof typeof ALIGN]
  bold: boolean
  italic: boolean
  underline: boolean
  lowercase: boolean
  uppercase: boolean
  capitalize: boolean
  highlight: boolean
  strikethrough: boolean
  code: boolean
  enableRichText: boolean
  enableText: boolean
  readOnly: boolean
  disabled: boolean
  editLink: boolean
  contentLength: number
  empty: boolean
  onAnchor: (element: HTMLElement | null) => void
  updateActiveEditor: (editor: LexicalEditor) => void
  updateFontSize: (target: string) => void
  updateFontFamily: (target: string) => void
  updateFontColor: (target: string) => void
  updateBackgroundColor: (target: string) => void
  updateBlock: (target: keyof typeof BLOCK) => void
  updateAlign: (target: (typeof ALIGN)[keyof typeof ALIGN]) => void
  toggleCanRedo: (target?: boolean) => void
  toggleCanUndo: (target?: boolean) => void
  toggleLink: (target?: boolean) => void
  toggleBold: (target?: boolean) => void
  toggleItalic: (target?: boolean) => void
  toggleUnderline: (target?: boolean) => void
  toggleCode: (target?: boolean) => void
  toggleEditLink: (target?: boolean) => void
  toggleLowercase: (target?: boolean) => void
  toggleUppercase: (target?: boolean) => void
  toggleCapitalize: (target?: boolean) => void
  toggleHighlight: (target?: boolean) => void
  toggleStrikethrough: (target?: boolean) => void
  redo: () => void
  undo: () => void
  formatBlock: (target: keyof typeof BLOCK) => void
  formatAlign: (target: (typeof ALIGN)[keyof typeof ALIGN]) => void
  formatFontColor: (target: string) => void
  formatBackgroundColor: (target: string) => void
  formatFontFamily: (target: string) => void
  formatFontSize: (target: string) => void
  formatLink: () => void
  formatBold: () => void
  formatItalic: () => void
  formatUnderline: () => void
  formatLowercase: () => void
  formatUppercase: () => void
  formatCapitalize: () => void
  formatHighlight: () => void
  formatStrikethrough: () => void
  formatCode: () => void
  clearFormatting: () => void
  updateValue: (value: string, source: ValueSource | 'text') => void
  insertValue: (value: string, source: ValueSource | 'text') => void
  insertImage: (payload: InsertImagePayload) => void
  insertMedia: (payload: InsertMediaPayload) => void
  insertIframe: (payload: InsertIframePayload) => void
  clearValue: () => void
  updateContentLength: (target: number) => void
  updateEmpty: (target: boolean) => void
  focus: (callbackFn?: () => void, options?: EditorFocusOptions) => void
  blur: () => void
}

export interface EditorContextProviderProps extends EditorContextProviderOptions {
  children?: React.ReactNode
}

export const intialEditorContext: Omit<EditorContext, 'editor' | 'activeEditor'> = {
  _injected: false,
  anchor: null,
  canRedo: false,
  canUndo: false,
  fontColor: '#000000',
  backgroundColor: '#ffffff',
  fontFamily: 'Arial',
  fontSize: '16px',
  link: false,
  block: 'root',
  align: ALIGN.left,
  bold: false,
  italic: false,
  code: false,
  underline: false,
  lowercase: false,
  uppercase: false,
  capitalize: false,
  highlight: false,
  strikethrough: false,
  enableRichText: false,
  enableText: false,
  readOnly: false,
  disabled: false,
  editLink: false,
  contentLength: 0,
  empty: true,
  onAnchor: () => null,
  updateActiveEditor: () => null,
  updateFontColor: () => null,
  updateBackgroundColor: () => null,
  updateFontSize: () => null,
  updateFontFamily: () => null,
  updateBlock: () => null,
  updateAlign: () => null,
  redo: () => null,
  undo: () => null,
  toggleCanRedo: () => null,
  toggleCanUndo: () => null,
  toggleLink: () => null,
  toggleBold: () => null,
  toggleItalic: () => null,
  toggleUnderline: () => null,
  toggleLowercase: () => null,
  toggleUppercase: () => null,
  toggleCapitalize: () => null,
  toggleHighlight: () => null,
  toggleStrikethrough: () => null,
  toggleCode: () => null,
  toggleEditLink: () => null,
  formatBlock: () => null,
  formatAlign: () => null,
  formatFontColor: () => null,
  formatBackgroundColor: () => null,
  formatFontFamily: () => null,
  formatFontSize: () => null,
  formatLink: () => null,
  formatBold: () => null,
  formatItalic: () => null,
  formatUnderline: () => null,
  formatLowercase: () => null,
  formatUppercase: () => null,
  formatCapitalize: () => null,
  formatHighlight: () => null,
  formatStrikethrough: () => null,
  formatCode: () => null,
  clearFormatting: () => null,
  updateValue: () => null,
  insertValue: () => null,
  insertImage: () => null,
  insertMedia: () => null,
  insertIframe: () => null,
  clearValue: () => null,
  updateContentLength: () => null,
  updateEmpty: () => null,
  focus: () => null,
  blur: () => null
}

export const ReactEditorContext = createContext<EditorContext>(intialEditorContext as EditorContext)

export function EditorContextProvider(props: EditorContextProviderProps) {
  const { children, ...rest } = props
  const editorContext = useEditorContextProvider(rest)

  return <ReactEditorContext.Provider value={editorContext}>{children}</ReactEditorContext.Provider>
}
