import type { EditorThemeClasses } from 'lexical'

import { normalizeClassNames } from './normalizeClassNames'

export function getCachedClassNameArray(
  classNamesTheme: EditorThemeClasses,
  classNameThemeType: string
): Array<string> {
  if (classNamesTheme.__lexicalClassNameCache === undefined) {
    classNamesTheme.__lexicalClassNameCache = {}
  }
  const classNamesCache = classNamesTheme.__lexicalClassNameCache
  const cachedClassNames = classNamesCache[classNameThemeType]
  if (cachedClassNames !== undefined) {
    return cachedClassNames
  }
  const classNames = classNamesTheme[classNameThemeType]
  // As we're using classList, we need
  // to handle className tokens that have spaces.
  // The easiest way to do this to convert the
  // className tokens to an array that can be
  // applied to classList.add()/remove().
  if (typeof classNames === 'string') {
    const classNamesArr = normalizeClassNames(classNames)
    classNamesCache[classNameThemeType] = classNamesArr
    return classNamesArr
  }
  return classNames
}
