import { $isTextNode, TextNode, type DOMConversionMap } from 'lexical'
import { intialEditorContext } from '../context/EditorContext'

export function parseAllowedFontSize(input: string) {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/)
  if (match) {
    return input
  }
  return ''
}

export function parseAllowedColor(input: string) {
  const hexRegex = /^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/
  const rgbRegex = /^rgb\(\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/
  const rgbaRegex = /^rgba\(\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\)$/

  return hexRegex.test(input) || rgbRegex.test(input) || rgbaRegex.test(input) ? input : ''
}

export function getExtraStyles(element: HTMLElement): string {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = ''
  const fontSize = parseAllowedFontSize(element.style.fontSize)
  const backgroundColor = parseAllowedColor(element.style.backgroundColor)
  const color = parseAllowedColor(element.style.color)
  if (fontSize !== '' && fontSize !== intialEditorContext.fontSize) {
    extraStyles += `font-size: ${fontSize};`
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`
  }
  return extraStyles
}

export function buildImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {}

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode)
      if (!importer) {
        return null
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element)
          if (output === null || output.forChild === undefined || output.after !== undefined || output.node !== null) {
            return output
          }
          const extraStyles = getExtraStyles(element)
          if (extraStyles) {
            const { forChild } = output
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent)
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles)
                }
                return textNode
              }
            }
          }
          return output
        }
      }
    }
  }

  return importMap
}

export function filterDomFromString(html: string) {
  const parse = new DOMParser()
  const dom = parse.parseFromString(html, 'text/html')
  const elementsWithBr = dom.querySelectorAll('*:not(br) > br')

  for (let i = 0; i < elementsWithBr.length; i += 1) {
    const brElement = elementsWithBr[i]
    const parentElement = brElement.parentNode

    const lastBr = parentElement?.querySelectorAll('br:last-child')[0]

    if (lastBr === brElement) {
      parentElement?.removeChild(brElement)
    }
  }

  return dom
}
