import { useRef } from 'react'
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import { NodeKey } from 'lexical'

export interface ReactIframeProps {
  src: string
  height: string
  elementAllow: string
  nodeKey: string
}

export function ReactIframe(props: ReactIframeProps) {
  const { src, height, elementAllow, nodeKey } = props

  const nodeRef = useRef<HTMLIFrameElement>(null)

  return (
    <BlockWithAlignableContents
      nodeKey={nodeKey as NodeKey}
      className={{ base: 'editor-iframe', focus: 'editor-iframe-focused' }}
    >
      <iframe ref={nodeRef} width='100%' style={{ height }} src={src} allow={elementAllow} draggable={false} />
    </BlockWithAlignableContents>
  )
}
