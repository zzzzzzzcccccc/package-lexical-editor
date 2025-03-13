import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'

import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ImageNode, $createImageNode, $isImageNode } from './ImageNode'

export const defaultNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  ImageNode
]

export { $createImageNode, $isImageNode }
