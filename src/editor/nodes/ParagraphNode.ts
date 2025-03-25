import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementFormatType,
  LexicalNode,
  ParagraphNode as LexicalParagraphNode,
  SerializedParagraphNode,
  setNodeIndentFromDOM
} from 'lexical'
import { getCachedClassNameArray } from '../utils/getCachedClassNameArray'

function $convertParagraphElement(element: HTMLElement): DOMConversionOutput {
  const node = $createParagraphNode()
  if (element.style) {
    node.setFormat(element.style.textAlign as ElementFormatType)
    setNodeIndentFromDOM(element, node)
  }
  return { node }
}

export class ParagraphNode extends LexicalParagraphNode {
  static getType(): string {
    return 'passage'
  }

  static clone(node: ParagraphNode): ParagraphNode {
    return new ParagraphNode(node.__key)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      p: () => ({
        conversion: $convertParagraphElement,
        priority: 0
      }),
      div: () => ({
        conversion: $convertParagraphElement,
        priority: 0
      })
    }
  }

  static importJSON(serializedNode: SerializedParagraphNode): ParagraphNode {
    return $createParagraphNode().updateFromJSON(serializedNode)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div')
    const classNames = getCachedClassNameArray(config.theme, 'paragraph')
    if (classNames !== undefined) {
      const domClassList = dom.classList
      domClassList.add(...classNames)
    }
    return dom
  }
}

export function $createParagraphNode(): ParagraphNode {
  return $applyNodeReplacement(new ParagraphNode())
}

export function $isParagraphNode(node: LexicalNode | null | undefined): node is ParagraphNode {
  return node instanceof ParagraphNode
}
