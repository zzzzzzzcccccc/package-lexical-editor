import { forwardRef } from 'react'
import { useEditorContext } from './hooks'
import { TreeViewPlugin } from './plugins'
import { RichTextEditor, TextEditor } from './components'

import type { ContentProps, EditorRef } from './types'

export const Content = forwardRef<EditorRef, ContentProps>((props, ref) => {
  const {
    className,
    style,
    placeholder,
    debug = false,
    autoFocus,
    headerSlot,
    footerSlot,
    floatMenuSlot,
    editorClassName,
    editorStyle,
    ignoreSelectionChange,
    outputValueSource,
    maxLength,
    enableMarkdownShortcut,
    enableDraggableBlock,
    triggerSpecialShortcutKey,
    triggerSpecialShortcutMenus,
    variableMenus,
    fetchMention,
    onChange,
    onDragDropPasteFiles
  } = props

  const { onAnchor, enableRichText, enableText } = useEditorContext()

  const contentClassName = ['root-lexical-editor', className].filter(Boolean).join(' ')

  return (
    <>
      <div ref={onAnchor} className={contentClassName} style={style}>
        {enableRichText && (
          <RichTextEditor
            placeholder={placeholder}
            autoFocus={autoFocus}
            editorStyle={editorStyle}
            editorClassName={editorClassName}
            headerSlot={headerSlot}
            footerSlot={footerSlot}
            floatMenuSlot={floatMenuSlot}
            ignoreSelectionChange={ignoreSelectionChange}
            outputValueSource={outputValueSource}
            maxLength={maxLength}
            onChange={onChange}
            onDragDropPasteFiles={onDragDropPasteFiles}
            enableMarkdownShortcut={enableMarkdownShortcut}
            enableDraggableBlock={enableDraggableBlock}
            fetchMention={fetchMention}
            triggerSpecialShortcutKey={triggerSpecialShortcutKey}
            triggerSpecialShortcutMenus={triggerSpecialShortcutMenus}
            variableMenus={variableMenus}
            ref={ref}
          />
        )}
        {enableText && (
          <TextEditor
            placeholder={placeholder}
            headerSlot={headerSlot}
            footerSlot={footerSlot}
            editorClassName={editorClassName}
            editorStyle={editorStyle}
            autoFocus={autoFocus}
            maxLength={maxLength}
            ignoreSelectionChange={ignoreSelectionChange}
            outputValueSource={outputValueSource}
            onChange={onChange}
            ref={ref}
          />
        )}
      </div>
      {debug && <TreeViewPlugin />}
    </>
  )
})
