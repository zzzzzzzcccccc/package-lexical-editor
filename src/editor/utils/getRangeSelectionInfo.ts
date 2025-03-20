import { RangeSelection } from 'lexical'
import { $isLinkNode } from '@lexical/link'

import { getSelectedNode } from './getSelectedNode'

export function getRangeSelectionInfo(rangeSelection: RangeSelection) {
  const node = getSelectedNode(rangeSelection)
  const parent = node.getParent()
  const grandpa = parent?.getParent()
  const isLinkNode = $isLinkNode(parent)

  return {
    node,
    parent,
    grandpa,
    isLinkNode
  }
}
