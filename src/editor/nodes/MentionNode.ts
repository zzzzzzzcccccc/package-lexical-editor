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
import { InsertMentionPayload } from '../types'

function $convertSpanElement(domNode: HTMLElement): null | DOMConversionOutput {
  const el = domNode as HTMLSpanElement
  if (!el || !el.hasAttribute('data-lexical-mention')) {
    return null
  }

  const mentionName = el?.textContent || el?.innerHTML
  const attributes = el.getAttribute('data-customer-attributes')

  if (mentionName !== null) {
    const node = $createMentionNode({ mentionName, attributes })
    return { node }
  }

  return null
}

export type SerializedMentionNode = Spread<
  {
    mentionName: string
    attributes?: string | null
  },
  SerializedTextNode
>

export class MentionNode extends TextNode {
  __mention: string
  __attributes: string | null

  static getType(): string {
    return 'mention'
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__attributes, node.__key)
  }

  static importJSON(serializedNode: SerializedMentionNode) {
    return $createMentionNode({
      mentionName: serializedNode.mentionName,
      attributes: serializedNode.attributes
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

  constructor(mentionName: string, attributes?: string | null, key?: NodeKey) {
    super(mentionName, key)
    this.__mention = mentionName
    this.__attributes = attributes || null
  }

  updateFromJSON(serializedNode: SerializedMentionNode) {
    return super.updateFromJSON(serializedNode)
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute('data-lexical-mention', 'true')
    if (this.__attributes !== null) {
      element.setAttribute('data-customer-attributes', this.__attributes)
    }
    element.textContent = this.__mention
    return { element }
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      attributes: this.__attributes
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const el = super.createDOM(config)
    const theme = config.theme
    const className = theme.mention
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

export function $createMentionNode({ mentionName, attributes }: InsertMentionPayload & { key?: NodeKey }): MentionNode {
  const node = new MentionNode(mentionName, attributes)
  node.setMode('token').toggleDirectionless()
  return $applyNodeReplacement(node)
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode
}
