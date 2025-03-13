import css from './style/index.scss?inline'

import { useMemo, forwardRef, useLayoutEffect } from 'react'
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'

import { EditorContextProvider } from './context/EditorContext'
import { Content } from './Content'
import { DEFAULT_THEME } from './constants'
import { defaultNodes } from './nodes'
import { buildImportMap, injectorCss } from './utils/dom'

import type { EditorProps, EditorRef } from './types'

export const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const { theme, onError, nodes = [], readOnly, editMode, disabled, ...rest } = props

  const finalNodes = useMemo(() => defaultNodes.concat(nodes), [nodes])
  const initialConfig: InitialConfigType = {
    namespace: rest.namespace,
    theme: {
      ...DEFAULT_THEME,
      ...theme
    },
    nodes: finalNodes,
    html: {
      import: buildImportMap()
    },
    onError: (error, editor) => {
      onError?.(error, editor)
    }
  }

  useLayoutEffect(() => {
    injectorCss(css)
  }, [])

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContextProvider editMode={editMode} readOnly={readOnly} disabled={disabled}>
        <Content {...rest} ref={ref} />
      </EditorContextProvider>
    </LexicalComposer>
  )
})
