import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, LexicalNode, NodeKey, Spread } from 'lexical'

import { ReactIframe } from '../components'
import { InsertIframePayload } from '../types'

type SerializedIframeNode = Spread<
  {
    src: string
    height: string
    elementAllow: string
  },
  SerializedDecoratorBlockNode
>

function $convertIframeElement(domNode: HTMLElement): DOMConversionOutput | null {
  const el = domNode as HTMLIFrameElement
  const { src, height, allow } = el

  if (el.src.startsWith('file:///')) {
    return null
  }

  const node = $createIframeNode({
    src,
    height: height || el.style?.height,
    elementAllow: allow
  })

  return { node }
}

export class IframeNode extends DecoratorBlockNode {
  __src: string
  __height: string
  __elementAllow: string

  static getType(): string {
    return 'iframe'
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__src, node.__height, node.__elementAllow, node.__key)
  }

  static importJSON(serializedNode: SerializedIframeNode): IframeNode {
    const { src, height, elementAllow } = serializedNode
    return $createIframeNode({
      src,
      height,
      elementAllow
    }).updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: () => {
        return {
          conversion: $convertIframeElement,
          priority: 0
        }
      }
    }
  }

  constructor(src: string, height: string, elementAllow?: string, key?: NodeKey) {
    super('left', key)
    this.__src = src
    this.__height = height
    this.__elementAllow = elementAllow || ''
  }

  updateFromJSON(serializedNode: SerializedIframeNode): this {
    return super.updateFromJSON(serializedNode)
  }

  updateDOM(): false {
    return false
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe')

    element.setAttribute('src', this.__src)
    element.setAttribute('width', '100%')
    element.setAttribute('height', this.__height)
    element.setAttribute('allow', this.__elementAllow)

    return { element }
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      src: this.__src,
      width: this.__width,
      height: this.__height,
      elementAllow: this.__elementAllow
    }
  }

  decorate() {
    return (
      <ReactIframe src={this.__src} height={this.__height} elementAllow={this.__elementAllow} nodeKey={this.getKey()} />
    )
  }
}

export function $createIframeNode({ src, height, elementAllow, key }: InsertIframePayload & { key?: NodeKey }) {
  return new IframeNode(src, height, elementAllow, key)
}

export function $isIframeNode(node: LexicalNode | null | undefined): node is IframeNode {
  return node instanceof IframeNode
}
