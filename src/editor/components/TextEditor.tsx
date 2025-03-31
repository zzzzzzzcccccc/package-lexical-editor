import { forwardRef, useImperativeHandle } from 'react'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { $getRoot, $getSelection, $isRangeSelection, EditorState } from 'lexical'

import { EditorPlaceholder } from './EditorPlaceholder'
import { useEditorContext } from '../hooks'
import { EditorProps, PlainTextRef } from '../types'
import { safeJSONStringify } from '../utils/json'
import { VALUE_SOURCE } from '../constants'
import { PastePlugin, DragDropPasteFilesPlugin } from '../plugins'

type TextEditorProps = Pick<
  EditorProps,
  | 'placeholder'
  | 'headerSlot'
  | 'footerSlot'
  | 'editorStyle'
  | 'editorClassName'
  | 'autoFocus'
  | 'onChange'
  | 'onPaste'
  | 'onDragDropPasteFiles'
  | 'maxLength'
  | 'ignoreSelectionChange'
  | 'outputValueSource'
>

export const TextEditor = forwardRef<PlainTextRef, TextEditorProps>((props, ref) => {
  const {
    placeholder,
    headerSlot,
    footerSlot,
    editorStyle,
    editorClassName,
    autoFocus,
    outputValueSource,
    onChange,
    onDragDropPasteFiles,
    onPaste
  } = props
  const { disabled, readOnly, updateContentLength, updateEmpty, updateValue, insertValue, focus, blur, clearValue } =
    useEditorContext()

  const edit = !disabled && !readOnly
  const contentClassName = ['content', editorClassName].filter(Boolean).join(' ')

  const handleOnChange = (editorState: EditorState) => {
    const isJSON = outputValueSource === VALUE_SOURCE.json
    const state = editorState.read(() => {
      const root = $getRoot()
      const content = root.getTextContent()
      const value = isJSON ? safeJSONStringify(editorState.toJSON(), '{}') : content
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
    insertValue,
    updateValue,
    focus,
    blur,
    clearValue
  }))

  return (
    <>
      <PlainTextPlugin
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
                style={editorStyle}
              />
            </div>
            {footerSlot}
          </>
        }
      />
      <PastePlugin onPaste={onPaste} />
      <DragDropPasteFilesPlugin onDragDropPasteFiles={onDragDropPasteFiles} />
      {Boolean(edit && autoFocus) && <AutoFocusPlugin {...autoFocus} />}
      <OnChangePlugin ignoreSelectionChange={props.ignoreSelectionChange} onChange={handleOnChange} />
    </>
  )
})
