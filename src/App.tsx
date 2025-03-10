import { Editor, useEditor } from './editor'

import './app.scss'

const blockList = [
  { name: 'Normal', value: 'paragraph' },
  { name: 'H1', value: 'h1' },
  { name: 'H2', value: 'h2' },
  { name: 'H3', value: 'h3' },
  { name: 'Bulleted List', value: 'bullet' },
  { name: 'Numbered List', value: 'number' },
  { name: 'Check List', value: 'check' }
]
const alignList = [
  { name: 'Left', value: 'left' },
  { name: 'Center', value: 'center' },
  { name: 'Right', value: 'right' },
  { name: 'Justify', value: 'justify' },
  { name: 'Start', value: 'start' },
  { name: 'End', value: 'end' }
]

function Toolbar() {
  const {
    block,
    bold,
    italic,
    underline,
    link,
    align,
    formatAlign,
    formatBlock,
    formatBold,
    formatItalic,
    formatLink,
    formatUnderline,
    clearFormatting
  } = useEditor()

  const blockValue = blockList.find((item) => item.value === block)?.value || 'paragraph'
  const alignValue = alignList.find((item) => item.value === align)?.value || 'left'

  return (
    <div className='toolbar'>
      <select value={blockValue} onChange={(e) => formatBlock(e.target.value as Parameters<typeof formatBlock>[0])}>
        {blockList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      <select value={alignValue} onChange={(e) => formatAlign(e.target.value as Parameters<typeof formatAlign>[0])}>
        {alignList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      <button type='button' className={bold ? 'active' : ''} onClick={formatBold}>
        B
      </button>
      <button type='button' className={italic ? 'active' : ''} onClick={formatItalic}>
        I
      </button>
      <button type='button' className={underline ? 'active' : ''} onClick={formatUnderline}>
        U
      </button>
      <button type='button' className={link ? 'active' : ''} onClick={formatLink}>
        Link
      </button>
      <button type='button' onClick={clearFormatting}>
        Clear format
      </button>
    </div>
  )
}

function App() {
  return (
    <>
      <Editor
        className='editor'
        namespace='playground'
        editMode='richText'
        autoFocus={{ defaultSelection: 'rootEnd' }}
        headerSlot={<Toolbar />}
        editorClassName='editor-content'
        footerSlot={<div>footer</div>}
        debug
      />
    </>
  )
}

export default App
