import React, { createContext } from 'react'
import type { LexicalEditor } from 'lexical'
import { useEditorContextProvider, type EditorContextProviderOptions } from '../hooks'
import { MISS_EDITOR_CONTEXT_PROVIDER, BLOCK, ALIGN } from '../constants'

export interface EditorContext {
  anchor: HTMLElement | null
  editor: LexicalEditor
  activeEditor: LexicalEditor
  link: boolean
  block: keyof typeof BLOCK
  align: (typeof ALIGN)[keyof typeof ALIGN]
  bold: boolean
  italic: boolean
  underline: boolean
  enableRichText: boolean
  enableText: boolean
  readOnly: boolean
  disabled: boolean
  editLink: boolean
  onAnchor: (element: HTMLElement | null) => void
  updateActiveEditor: (editor: LexicalEditor) => void
  updateBlock: (target: keyof typeof BLOCK) => void
  updateAlign: (target: (typeof ALIGN)[keyof typeof ALIGN]) => void
  toggleLink: (target?: boolean) => void
  toggleBold: (target?: boolean) => void
  toggleItalic: (target?: boolean) => void
  toggleUnderline: (target?: boolean) => void
  toggleEditLink: (target?: boolean) => void
  formatBlock: (target: keyof typeof BLOCK) => void
  formatAlign: (target: (typeof ALIGN)[keyof typeof ALIGN]) => void
  formatLink: () => void
  formatBold: () => void
  formatItalic: () => void
  formatUnderline: () => void
  clearFormatting: () => void
}

export interface EditorContextProviderProps extends EditorContextProviderOptions {
  children?: React.ReactNode
}

const intialEditorContext: Omit<EditorContext, 'editor' | 'activeEditor'> = {
  anchor: null,
  link: false,
  block: 'paragraph',
  align: ALIGN.left,
  bold: false,
  italic: false,
  underline: false,
  enableRichText: false,
  enableText: false,
  readOnly: false,
  disabled: false,
  editLink: false,
  onAnchor: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  updateActiveEditor: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  updateBlock: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  updateAlign: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  toggleLink: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  toggleBold: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  toggleItalic: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  toggleUnderline: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  toggleEditLink: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatBlock: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatAlign: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatLink: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatBold: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatItalic: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  formatUnderline: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER),
  clearFormatting: () => new Error(MISS_EDITOR_CONTEXT_PROVIDER)
}

export const ReactEditorContext = createContext<EditorContext>(intialEditorContext as EditorContext)

export function EditorContextProvider(props: EditorContextProviderProps) {
  const { children, ...rest } = props
  const editorContext = useEditorContextProvider(rest)

  return <ReactEditorContext.Provider value={editorContext}>{children}</ReactEditorContext.Provider>
}
