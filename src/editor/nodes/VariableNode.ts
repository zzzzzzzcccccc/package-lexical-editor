import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode
} from 'lexical'
import { InsertVariablePayload } from '../types'

function $convertSpanElement(domNode: HTMLElement): null | DOMConversionOutput {
  const el = domNode as HTMLSpanElement
  if (!el || !el.hasAttribute('data-lexical-variable')) {
    return null
  }

  const variable = el?.textContent || el?.innerHTML

  if (variable !== null) {
    const node = $createVariableNode({ variable })
    return { node }
  }

  return null
}

export type SerializedVariableNode = Spread<
  {
    variable: string
  },
  SerializedTextNode
>

export class VariableNode extends TextNode {
  __variable: string

  static getType(): string {
    return 'variable'
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__variable, node.__key)
  }

  static importJSON(serializedNode: SerializedVariableNode) {
    return $createVariableNode({
      variable: serializedNode.variable
    }).updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: () => ({
        conversion: $convertSpanElement,
        priority: 0
      })
    }
  }

  constructor(variable: string, key?: NodeKey) {
    super(variable, key)
    this.__variable = variable
  }

  updateFromJSON(serializedNode: SerializedVariableNode) {
    return super.updateFromJSON(serializedNode)
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute('data-lexical-variable', 'true')
    element.textContent = this.__variable
    return { element }
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      variable: this.__variable
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const el = super.createDOM(config)
    const theme = config.theme
    const className = theme.variable
    if (className !== undefined) {
      el.className = className
    }
    el.spellcheck = false
    return el
  }

  isTextEntity(): true {
    return true
  }

  canInsertTextBefore(): boolean {
    return false
  }

  canInsertTextAfter(): boolean {
    return false
  }

  setFormat() {
    return this
  }

  setStyle() {
    return this
  }
}

export function $createVariableNode({ variable }: InsertVariablePayload & { key?: NodeKey }): VariableNode {
  const node = new VariableNode(variable)
  node.setMode('token').toggleDirectionless()
  return $applyNodeReplacement(node)
}

export function $isVariableNode(node: LexicalNode | null | undefined): node is VariableNode {
  return node instanceof VariableNode
}
