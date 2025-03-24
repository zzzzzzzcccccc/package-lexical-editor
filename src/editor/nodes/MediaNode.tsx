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

import { InsertMediaPayload, MediaNodeType } from '../types'
import { MEDIA_NODE_TYPE } from '../constants'
import { ReactMedia } from '../components'

function $convertAudioElement(domNode: Node): null | DOMConversionOutput {
  const el = domNode as HTMLAudioElement
  if (el.src.startsWith('file:///')) {
    return null
  }

  const { src, style } = el
  const attributes = el.getAttribute('data-customer-attributes')
  const node = $createMediaNode({
    width: style?.width,
    height: style?.height,
    src,
    mediaType: MEDIA_NODE_TYPE.audio,
    attributes
  })

  return { node }
}

function $convertVideoElement(domNode: Node): null | DOMConversionOutput {
  const el = domNode as HTMLVideoElement
  if (el.src.startsWith('file:///')) {
    return null
  }
  const { src, style } = el
  const attributes = el.getAttribute('customer-attributes') || null
  const node = $createMediaNode({
    width: style?.width,
    height: style?.height,
    src,
    mediaType: MEDIA_NODE_TYPE.video,
    attributes
  })
  return { node }
}

export type SerializedMediaNode = Spread<
  {
    src: string
    mediaType: MediaNodeType
    height?: string
    width?: string
    attributes?: string | null
  },
  SerializedLexicalNode
>

export class MediaNode extends DecoratorNode<React.ReactNode> {
  __src: string
  __mediaType: MediaNodeType
  __width: string
  __height: string
  __attributes: string | null

  static getType(): string {
    return 'media'
  }

  static clone(node: MediaNode): MediaNode {
    return new MediaNode(node.__src, node.__mediaType, node.__width, node.__height, node.__attributes, node.__key)
  }

  static importJSON(serializedNode: SerializedMediaNode): MediaNode {
    const { src, mediaType, height, width, attributes } = serializedNode
    return $createMediaNode({
      src,
      mediaType,
      height,
      width,
      attributes
    }).updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      audio: () => ({
        conversion: $convertAudioElement,
        priority: 0
      }),
      video: () => ({
        conversion: $convertVideoElement,
        priority: 0
      })
    }
  }

  constructor(
    src: string,
    mediaType: MediaNodeType,
    width?: string,
    height?: string,
    attributes?: string | null,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__mediaType = mediaType
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
    this.__attributes = attributes ?? null
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedMediaNode>): this {
    return super.updateFromJSON(serializedNode)
  }

  exportDOM(): DOMExportOutput {
    const element =
      this.__mediaType === MEDIA_NODE_TYPE.audio ? document.createElement('audio') : document.createElement('video')
    element.setAttribute('src', this.__src)
    element.setAttribute('controls', 'controls')
    if (this.__width !== 'inherit') {
      element.style.width = this.__width
    }
    if (this.__height !== 'inherit') {
      element.style.height = this.__height
    }
    if (this.__attributes) {
      element.setAttribute('data-customer-attributes', this.__attributes)
    }
    return { element }
  }

  exportJSON(): SerializedMediaNode {
    return {
      ...super.exportJSON(),
      width: this.__width === 'inherit' ? undefined : this.__width,
      height: this.__height === 'inherit' ? undefined : this.__height,
      mediaType: this.__mediaType,
      src: this.getSrc(),
      attributes: this.__attributes
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.media
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

  decorate() {
    return (
      <ReactMedia
        src={this.__src}
        mediaType={this.__mediaType}
        width={this.__width === 'inherit' ? undefined : this.__width}
        height={this.__height === 'inherit' ? undefined : this.__height}
        attributes={this.__attributes}
        nodeKey={this.getKey()}
      />
    )
  }
}

export function $createMediaNode({
  mediaType,
  height,
  src,
  width,
  attributes,
  key
}: InsertMediaPayload & { key?: NodeKey }): MediaNode {
  return $applyNodeReplacement(new MediaNode(src, mediaType, width, height, attributes, key))
}

export function $isMediaNode(node: LexicalNode | null | undefined): node is MediaNode {
  return node instanceof MediaNode
}
