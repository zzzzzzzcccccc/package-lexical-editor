import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $getSelection, $isRangeSelection } from 'lexical'

import { validateUrl } from '../utils/url'
import { useEditorContext } from '../hooks'
import { $isIframeNode, $isImageNode, $isMediaNode, $isMentionNode } from '../nodes'

export function LinkPlugin() {
  const { activeEditor } = useEditorContext()

  const handleOnValidateUrl = (url: string) => {
    const nodes = activeEditor.getEditorState().read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes()
        return nodes.filter((node) => {
          return $isImageNode(node) || $isMediaNode(node) || $isIframeNode(node) || $isMentionNode(node)
        })
      }
      return []
    })

    if (nodes.length > 0) {
      return false
    }

    return validateUrl(url)
  }

  return (
    <LexicalLinkPlugin
      validateUrl={handleOnValidateUrl}
      attributes={{ rel: 'noopener noreferrer', target: '_blank' }}
    />
  )
}
