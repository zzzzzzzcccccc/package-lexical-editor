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
  const attributes = el.getAttribute('data-customer-attributes')

  if (variable !== null) {
    const node = $createVariableNode({ variable, attributes })
    return { node }
  }

  return null
}

export type SerializedVariableNode = Spread<
  {
    variable: string
    attributes?: string | null
  },
  SerializedTextNode
>

export class VariableNode extends TextNode {
  __variable: string
  __attributes: string | null

  static getType(): string {
    return 'variable'
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__variable, node.__attributes, node.__key)
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

  constructor(variable: string, attributes?: string | null, key?: NodeKey) {
    super(variable, key)
    this.__variable = variable
    this.__attributes = attributes || null
  }

  updateFromJSON(serializedNode: SerializedVariableNode) {
    return super.updateFromJSON(serializedNode)
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute('data-lexical-variable', 'true')
    element.textContent = this.__variable
    if (this.__attributes !== null) {
      element.setAttribute('data-customer-attributes', this.__attributes)
    }
    return { element }
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      variable: this.__variable,
      attributes: this.__attributes
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const el = super.createDOM(config)
    const theme = config.theme
    const className = theme.variable
    if (className !== undefined) {
      el.className = className
    }
    if (this.__attributes !== null) {
      el.setAttribute('data-customer-attributes', this.__attributes)
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

export function $createVariableNode({ variable, attributes }: InsertVariablePayload & { key?: NodeKey }): VariableNode {
  const node = new VariableNode(variable, attributes)
  node.setMode('token').toggleDirectionless()
  return $applyNodeReplacement(node)
}

export function $isVariableNode(node: LexicalNode | null | undefined): node is VariableNode {
  return node instanceof VariableNode
}
