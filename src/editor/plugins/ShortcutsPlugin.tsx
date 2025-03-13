import { useEffect, useCallback } from 'react'
import { useEditorContext } from '../hooks'
import { COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND } from 'lexical'
import {
  isFormatParagraph,
  isFormatHeading,
  isFormatBulletList,
  isFormatNumberedList,
  isFormatCheckList,
  isFormatQuote,
  isFormatCode,
  isLowercase,
  isUppercase,
  isCapitalize,
  isStrikeThrough,
  isHighlight,
  isClearFormatting,
  isInsertLink
} from '../utils/shortcuts'

export function ShortcutsPlugin() {
  const {
    activeEditor,
    formatBlock,
    formatUppercase,
    formatLowercase,
    formatCapitalize,
    formatStrikethrough,
    formatCode,
    formatLink,
    formatHighlight,
    clearFormatting
  } = useEditorContext()

  const keyboardShortcutsHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isFormatParagraph(event)) {
        event.preventDefault()
        formatBlock('paragraph')

        return true
      }

      if (isFormatHeading(event)) {
        event.preventDefault()
        const { code } = event
        formatBlock(`h${code[code.length - 1]}` as Parameters<typeof formatBlock>[0])

        return true
      }

      if (isFormatBulletList(event)) {
        event.preventDefault()
        formatBlock('bullet')

        return true
      }

      if (isFormatNumberedList(event)) {
        event.preventDefault()
        formatBlock('number')

        return true
      }

      if (isFormatCheckList(event)) {
        event.preventDefault()
        formatBlock('check')

        return true
      }

      if (isFormatQuote(event)) {
        event.preventDefault()
        formatBlock('quote')

        return true
      }

      if (isFormatCode(event)) {
        event.preventDefault()
        formatCode()

        return true
      }

      if (isHighlight(event)) {
        event.preventDefault()
        formatHighlight()

        return true
      }

      if (isLowercase(event)) {
        event.preventDefault()
        formatLowercase()

        return true
      }

      if (isUppercase(event)) {
        event.preventDefault()
        formatUppercase()

        return true
      }

      if (isCapitalize(event)) {
        event.preventDefault()
        formatCapitalize()

        return true
      }

      if (isStrikeThrough(event)) {
        event.preventDefault()
        formatStrikethrough()

        return true
      }

      if (isInsertLink(event)) {
        event.preventDefault()
        formatLink()
      }

      if (isClearFormatting(event)) {
        event.preventDefault()
        clearFormatting()

        return true
      }

      return false
    },
    [
      clearFormatting,
      formatBlock,
      formatCapitalize,
      formatCode,
      formatHighlight,
      formatLink,
      formatLowercase,
      formatStrikethrough,
      formatUppercase
    ]
  )

  useEffect(() => {
    return activeEditor.registerCommand(KEY_MODIFIER_COMMAND, keyboardShortcutsHandler, COMMAND_PRIORITY_NORMAL)
  }, [activeEditor, keyboardShortcutsHandler])

  return null
}
