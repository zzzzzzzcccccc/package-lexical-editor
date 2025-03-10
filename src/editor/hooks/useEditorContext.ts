import { useContext } from 'react'
import { ReactEditorContext } from '../context/EditorContext'

export function useEditorContext() {
  return useContext(ReactEditorContext)
}

export function useEditor() {
  const {
    block,
    bold,
    italic,
    underline,
    align,
    link,
    disabled,
    readOnly,
    editLink,
    formatLink,
    formatAlign,
    formatBlock,
    formatBold,
    formatItalic,
    formatUnderline,
    clearFormatting
  } = useEditorContext()

  return {
    block,
    bold,
    italic,
    underline,
    align,
    link,
    disabled,
    readOnly,
    editLink,
    formatLink,
    formatAlign,
    formatBlock,
    formatBold,
    formatItalic,
    formatUnderline,
    clearFormatting
  }
}
