import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

import { ListenerFormatStatePlugin, LinkPlugin, AutoLinkPlugin, FloatLinkPlugin } from '../plugins'
import { EditorPlaceholder } from './EditorPlaceholder'
import { useEditorContext } from '../hooks'

import type { EditorProps } from '../types'

type RichTextEditorProps = Pick<
  EditorProps,
  'placeholder' | 'autoFocus' | 'editorStyle' | 'editorClassName' | 'headerSlot' | 'footerSlot'
>

export function RichTextEditor(props: RichTextEditorProps) {
  const { placeholder, autoFocus, editorStyle, editorClassName, headerSlot, footerSlot } = props

  const { disabled, readOnly, anchor } = useEditorContext()

  const contentClassName = ['content', editorClassName].filter(Boolean).join(' ')
  const enableAutoFocus = autoFocus && !disabled && !readOnly

  return (
    <>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<EditorPlaceholder>{placeholder}</EditorPlaceholder>}
        contentEditable={
          <>
            {headerSlot}
            <ContentEditable className={contentClassName} style={editorStyle} />
            {footerSlot}
          </>
        }
      />
      <ListenerFormatStatePlugin />
      {enableAutoFocus && <AutoFocusPlugin {...autoFocus} />}
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      {anchor && <FloatLinkPlugin anchor={anchor} />}
    </>
  )
}
