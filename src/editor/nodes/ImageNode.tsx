import React from 'react'
import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from 'lexical'

import { InsertImagePayload } from '../types'
import { ReactImage } from '../components'

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement
  if (img.src.startsWith('file:///')) {
    return null
  }
  const { alt: altText, src, width, height } = img
  const attributes = img.getAttribute('customer-attributes') || null
  const node = $createImageNode({ altText, height, src, width, attributes })
  return { node }
}

export type SerializedImageNode = Spread<
  {
    src: string
    altText: string
    height?: number
    maxWidth: number
    width?: number
    attributes?: string | null
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __maxWidth: number
  __attributes: string | null

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__attributes,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src, attributes } = serializedNode
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      attributes
    }).updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0
      })
    }
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    attributes?: string | null,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
    this.__attributes = attributes ?? null
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    return super.updateFromJSON(serializedNode)
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())
    if (this.__attributes) {
      element.setAttribute('customer-attributes', this.__attributes)
    }
    return { element }
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      width: this.__width === 'inherit' ? undefined : this.__width,
      height: this.__height === 'inherit' ? undefined : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      attributes: this.__attributes
    }
  }

  setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate() {
    return (
      <ReactImage
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        attributes={this.__attributes}
        nodeKey={this.getKey()}
      />
    )
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  attributes,
  key
}: InsertImagePayload & { key?: NodeKey }): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, attributes, key))
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}
