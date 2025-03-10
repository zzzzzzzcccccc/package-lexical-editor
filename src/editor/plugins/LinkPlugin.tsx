import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'

import { validateUrl } from '../utils/url'

export function LinkPlugin() {
  return <LexicalLinkPlugin validateUrl={validateUrl} attributes={{ rel: 'noopener noreferrer', target: '_blank' }} />
}
