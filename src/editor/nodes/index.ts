import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'

import { HeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'

export const defaultNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode
]
