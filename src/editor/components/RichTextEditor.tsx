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
  ShortcutsPlugin,
  MentionPlugin,
  ImagePlugin,
  MediaPlugin,
  IframePlugin,
  PastePlugin,
  DragDropPasteFilesPlugin,
  SpecialShortcutToolbarPlugin,
  VariablePlugin,
  VaribleShortcutToolbarPlugin,
  FloatMenuPlugin
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
  | 'floatMenuSlot'
  | 'ignoreSelectionChange'
  | 'outputValueSource'
  | 'onChange'
  | 'onPaste'
  | 'onDragDropPasteFiles'
  | 'maxLength'
  | 'enableMarkdownShortcut'
  | 'enableDraggableBlock'
  | 'fetchMention'
  | 'triggerSpecialShortcutKey'
  | 'triggerSpecialShortcutMenus'
  | 'variableMenus'
>

export const RichTextEditor = forwardRef<EditorRef, RichTextEditorProps>((props, ref) => {
  const {
    placeholder,
    autoFocus,
    editorStyle,
    editorClassName,
    headerSlot,
    footerSlot,
    floatMenuSlot,
    ignoreSelectionChange = true,
    outputValueSource = VALUE_SOURCE.html,
    maxLength = -1,
    enableMarkdownShortcut = true,
    enableDraggableBlock = true,
    triggerSpecialShortcutKey = '/',
    triggerSpecialShortcutMenus = [],
    variableMenus = [],
    onChange,
    onPaste,
    onDragDropPasteFiles,
    fetchMention
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
    insertVariable,
    clearValue,
    updateContentLength,
    updateEmpty,
    focus,
    blur,
    undo,
    redo,
    formatBlock,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontFamily,
    formatFontSize,
    formatLink,
    formatBold,
    formatItalic,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatStrikethrough,
    formatHighlight,
    formatCode,
    clearFormatting
  } = useEditorContext()

  const edit = !disabled && !readOnly
  const contentClassName = ['content', editorClassName].filter(Boolean).join(' ')

  const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
    const isJSON = outputValueSource === VALUE_SOURCE.json
    const state = editorState.read(() => {
      const value = isJSON ? safeJSONStringify(editorState.toJSON(), '{}') : $generateHtmlFromNodes(editor)
      const root = $getRoot()
      const content = root.getTextContent()
      const contentSize = content.length
      const empty = Boolean(!content.trim() || root.isEmpty())
      const selection = $getSelection()
      const isRangeSelection = $isRangeSelection(selection)

      return {
        value,
        contentSize,
        empty,
        selection,
        isRangeSelection
      }
    })
    updateContentLength(state.contentSize)
    updateEmpty(state.empty)
    onChange?.(state)
  }

  useImperativeHandle(ref, () => ({
    updateValue,
    insertValue,
    insertImage,
    insertMedia,
    insertIframe,
    insertVariable,
    clearValue,
    focus,
    blur,
    undo,
    redo,
    formatBlock,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontFamily,
    formatFontSize,
    formatLink,
    formatBold,
    formatItalic,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatStrikethrough,
    formatHighlight,
    formatCode,
    clearFormatting
  }))

  return (
    <>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<EditorPlaceholder>{placeholder}</EditorPlaceholder>}
        contentEditable={
          <>
            {headerSlot}
            <div className='editor-wrapper'>
              <ContentEditable
                aria-disabled={disabled}
                aria-readonly={readOnly}
                className={contentClassName}
                style={{ paddingLeft: enableDraggableBlock ? 20 : 6, ...editorStyle }}
              />
            </div>
            {footerSlot}
          </>
        }
      />
      <HistoryPlugin />
      {Boolean(autoFocus && edit) && <AutoFocusPlugin {...autoFocus} />}
      <ListenerFormatStatePlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      <TabFocusPlugin />
      <TabIndentationPlugin />
      <ShortcutsPlugin />
      <ImagePlugin />
      <MediaPlugin />
      <IframePlugin />
      <VariablePlugin />
      <PastePlugin onPaste={onPaste} />
      <DragDropPasteFilesPlugin onDragDropPasteFiles={onDragDropPasteFiles} />
      {fetchMention ? <MentionPlugin fetchMention={fetchMention} /> : null}
      {Boolean(anchor && enableDraggableBlock) && <DraggableBlockPlugin anchor={anchor!} />}
      {anchor && <FloatLinkPlugin anchor={anchor} />}
      {maxLength > 0 && <MaxLengthPlugin maxLength={maxLength} />}
      {enableMarkdownShortcut && <MarkdownShortcutPlugin />}
      {triggerSpecialShortcutMenus.length > 0 && (
        <SpecialShortcutToolbarPlugin triggerKey={triggerSpecialShortcutKey} options={triggerSpecialShortcutMenus} />
      )}
      {variableMenus.length > 0 && <VaribleShortcutToolbarPlugin options={variableMenus} />}
      {Boolean(anchor && floatMenuSlot && edit) && <FloatMenuPlugin anchor={anchor!}>{floatMenuSlot}</FloatMenuPlugin>}
      <OnChangePlugin ignoreSelectionChange={ignoreSelectionChange} onChange={handleOnChange} />
    </>
  )
})
