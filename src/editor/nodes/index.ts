import { Klass, LexicalNode, LexicalNodeReplacement, ParagraphNode as LexicalParagraphNode } from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'

import { $isParagraphNode, $createParagraphNode, ParagraphNode } from './ParagraphNode'
import { ImageNode, $createImageNode, $isImageNode } from './ImageNode'
import { $createMediaNode, $isMediaNode, MediaNode } from './MediaNode'
import { $createIframeNode, $isIframeNode, IframeNode } from './IframeNode'
import { $createMentionNode, $isMentionNode, MentionNode } from './MentionNode'
import { $createVariableNode, $isVariableNode, VariableNode } from './VariableNode'

export const nodes: Array<Klass<LexicalNode> | LexicalNodeReplacement> = [
  ParagraphNode,
  {
    replace: LexicalParagraphNode,
    with: () => {
      return $createParagraphNode()
    }
  },
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
  MediaNode,
  IframeNode,
  MentionNode,
  VariableNode
]

export {
  $isParagraphNode,
  $createParagraphNode,
  $createImageNode,
  $isImageNode,
  $createMediaNode,
  $isMediaNode,
  $createIframeNode,
  $isIframeNode,
  $createMentionNode,
  $isMentionNode,
  $createVariableNode,
  $isVariableNode
}
