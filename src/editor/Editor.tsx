import { useMemo } from 'react'
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'

import { EditorContextProvider } from './context/EditorContext'
import { Content } from './Content'
import { DEFAULT_THEME } from './constants'
import { defaultNodes } from './nodes'

import { EditorProps } from './types'

import './style/index.scss'

export function Editor(props: EditorProps) {
  const { theme, onError, nodes = [], ...rest } = props

  const finalNodes = useMemo(() => defaultNodes.concat(nodes), [nodes])
  const initialConfig: InitialConfigType = {
    namespace: rest.namespace,
    theme: {
      ...DEFAULT_THEME,
      ...theme
    },
    nodes: finalNodes,
    onError: (error, editor) => {
      onError?.(error, editor)
    }
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContextProvider>
        <Content {...rest} />
      </EditorContextProvider>
    </LexicalComposer>
  )
}
