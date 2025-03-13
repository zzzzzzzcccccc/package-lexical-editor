import { useContext } from 'react'
import { ReactEditorContext } from '../context/EditorContext'

export function useEditorContext() {
  const context = useContext(ReactEditorContext)

  if (!context._injected) {
    throw new Error('useEditorContext must be used within an EditorContextProvider')
  }

  return context
}

export function useEditor() {
  const {
    block,
    bold,
    italic,
    underline,
    lowercase,
    uppercase,
    capitalize,
    highlight,
    strikethrough,
    code,
    align,
    fontColor,
    backgroundColor,
    fontSize,
    fontFamily,
    link,
    disabled,
    readOnly,
    editLink,
    contentLength,
    empty,
    formatLink,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontSize,
    formatFontFamily,
    formatBlock,
    formatBold,
    formatItalic,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatHighlight,
    formatStrikethrough,
    formatCode,
    clearFormatting,
    updateValue,
    insertValue,
    insertImage,
    clearValue,
    focus,
    blur
  } = useEditorContext()

  return {
    block,
    bold,
    italic,
    underline,
    lowercase,
    uppercase,
    capitalize,
    highlight,
    strikethrough,
    code,
    align,
    fontColor,
    backgroundColor,
    fontSize,
    fontFamily,
    link,
    disabled,
    readOnly,
    editLink,
    contentLength,
    empty,
    formatLink,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontSize,
    formatFontFamily,
    formatBlock,
    formatBold,
    formatItalic,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatHighlight,
    formatStrikethrough,
    formatCode,
    clearFormatting,
    updateValue,
    insertValue,
    insertImage,
    clearValue,
    focus,
    blur
  }
}
