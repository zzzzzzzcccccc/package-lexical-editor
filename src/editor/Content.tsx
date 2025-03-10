import { useEditorContext } from './hooks'
import { TreeViewPlugin } from './plugins'
import { RichTextEditor } from './components'

import type { ContentProps } from './types'

export function Content(props: ContentProps) {
  const {
    className,
    style,
    placeholder,
    debug = false,
    autoFocus,
    headerSlot,
    footerSlot,
    editorClassName,
    editorStyle
  } = props

  const { onAnchor } = useEditorContext()

  const contentClassName = ['root-lexical-editor', className].filter(Boolean).join(' ')

  return (
    <>
      <div ref={onAnchor} className={contentClassName} style={style}>
        <RichTextEditor
          placeholder={placeholder}
          autoFocus={autoFocus}
          editorStyle={editorStyle}
          editorClassName={editorClassName}
          headerSlot={headerSlot}
          footerSlot={footerSlot}
        />
      </div>
      {debug && <TreeViewPlugin />}
    </>
  )
}
