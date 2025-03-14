import { forwardRef, useImperativeHandle } from 'react'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { $generateHtmlFromNodes } from '@lexical/html'
import { $getRoot, $getSelection, $isRangeSelection, type EditorState, type LexicalEditor } from 'lexical'

import {
  ListenerFormatStatePlugin,
  LinkPlugin,
  AutoLinkPlugin,
  FloatLinkPlugin,
  DraggableBlockPlugin,
  MaxLengthPlugin,
  MarkdownShortcutPlugin,
  TabFocusPlugin,
  ShortcutsPlugin
} from '../plugins'
import { EditorPlaceholder } from './EditorPlaceholder'
import { useEditorContext } from '../hooks'
import { VALUE_SOURCE } from '../constants'

import type { EditorProps, EditorRef } from '../types'
import { safeJSONStringify } from '../utils/json'

type RichTextEditorProps = Pick<
  EditorProps,
  | 'placeholder'
  | 'autoFocus'
  | 'editorStyle'
  | 'editorClassName'
  | 'headerSlot'
  | 'footerSlot'
  | 'ignoreSelectionChange'
  | 'outputValueSource'
  | 'onChange'
  | 'maxLength'
  | 'enableMarkdownShortcut'
  | 'enableDraggableBlock'
>

export const RichTextEditor = forwardRef<EditorRef, RichTextEditorProps>((props, ref) => {
  const {
    placeholder,
    autoFocus,
    editorStyle,
    editorClassName,
    headerSlot,
    footerSlot,
    ignoreSelectionChange = true,
    outputValueSource = VALUE_SOURCE.html,
    maxLength = -1,
    enableMarkdownShortcut = true,
    enableDraggableBlock = true,
    onChange
  } = props

  const {
    disabled,
    readOnly,
    anchor,
    updateValue,
    insertValue,
    insertImage,
    insertMedia,
    insertIframe,
    clearValue,
    updateContentLength,
    updateEmpty,
    focus,
    blur,
    undo,
    redo
  } = useEditorContext()

  const contentClassName = ['content', editorClassName].filter(Boolean).join(' ')
  const enableAutoFocus = autoFocus && !disabled && !readOnly

  const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
    const isJSON = outputValueSource === VALUE_SOURCE.json

    editorState.read(() => {
      const value = isJSON ? safeJSONStringify(editorState.toJSON(), '{}') : $generateHtmlFromNodes(editor)
      const root = $getRoot()
      const content = root.getTextContent()
      const contentSize = content.length
      const empty = Boolean(!content.trim() || root.isEmpty())
      const selection = $getSelection()
      const isRangeSelection = $isRangeSelection(selection)

      updateContentLength(contentSize)
      updateEmpty(empty)

      onChange?.({ value, contentSize, empty, selection, isRangeSelection })
    })
  }

  useImperativeHandle(ref, () => ({
    updateValue,
    insertValue,
    insertImage,
    insertMedia,
    insertIframe,
    clearValue,
    focus,
    blur,
    undo,
    redo
  }))

  return (
    <>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<EditorPlaceholder>{placeholder}</EditorPlaceholder>}
        contentEditable={
          <>
            {headerSlot}
            <ContentEditable
              aria-disabled={disabled}
              aria-readonly={readOnly}
              className={contentClassName}
              style={{ paddingLeft: enableDraggableBlock ? 20 : 6, ...editorStyle }}
            />
            {footerSlot}
          </>
        }
      />
      <HistoryPlugin />
      {enableAutoFocus && <AutoFocusPlugin {...autoFocus} />}
      <ListenerFormatStatePlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      <TabFocusPlugin />
      <TabIndentationPlugin />
      <ShortcutsPlugin />
      {Boolean(anchor && enableDraggableBlock) && <DraggableBlockPlugin anchor={anchor!} />}
      {anchor && <FloatLinkPlugin anchor={anchor} />}
      {maxLength > 0 && <MaxLengthPlugin maxLength={maxLength} />}
      {enableMarkdownShortcut && <MarkdownShortcutPlugin />}
      <OnChangePlugin ignoreSelectionChange={ignoreSelectionChange} onChange={handleOnChange} />
    </>
  )
})
