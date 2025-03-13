import { IS_APPLE } from './device'

export function controlOrMeta(metaKey: boolean, ctrlKey: boolean): boolean {
  return IS_APPLE ? metaKey : ctrlKey
}

export function isFormatParagraph(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event

  return (code === 'Numpad0' || code === 'Digit0') && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatHeading(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  const keyNumber = code[code.length - 1]

  return ['1', '2', '3', '4', '5', '6'].includes(keyNumber) && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatBulletList(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad7' || code === 'Digit7') && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatNumberedList(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad8' || code === 'Digit8') && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatCheckList(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad9' || code === 'Digit9') && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatQuote(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'KeyQ' && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isFormatCode(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'KeyC' && !shiftKey && altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isLowercase(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad1' || code === 'Digit1') && shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isUppercase(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad2' || code === 'Digit2') && shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isCapitalize(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return (code === 'Numpad3' || code === 'Digit3') && shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isStrikeThrough(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'KeyS' && shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isHighlight(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'KeyH' && shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isClearFormatting(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'Backslash' && !shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}

export function isInsertLink(event: KeyboardEvent): boolean {
  const { code, shiftKey, altKey, metaKey, ctrlKey } = event
  return code === 'KeyK' && !shiftKey && !altKey && controlOrMeta(metaKey, ctrlKey)
}
