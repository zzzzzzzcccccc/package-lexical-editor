import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'

import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ImageNode, $createImageNode, $isImageNode } from './ImageNode'
import { $createMediaNode, $isMediaNode, MediaNode } from './MediaNode'
import { $createIframeNode, $isIframeNode, IframeNode } from './IframeNode'
import { $createMentionNode, $isMentionNode, MentionNode } from './MentionNode'

export const nodes: Array<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
  MediaNode,
  IframeNode,
  MentionNode
]

export {
  $createImageNode,
  $isImageNode,
  $createMediaNode,
  $isMediaNode,
  $createIframeNode,
  $isIframeNode,
  $createMentionNode,
  $isMentionNode
}
