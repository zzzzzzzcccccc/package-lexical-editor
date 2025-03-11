import { useRef, useState } from 'react'
import { Editor, useEditor, type EditorRef, type EditorProps, type EditorOnChangePayload } from './editor'

import './app.scss'

const maxLength = 10000
const blockList = [
  { name: 'Normal', value: 'paragraph' },
  { name: 'H1', value: 'h1' },
  { name: 'H2', value: 'h2' },
  { name: 'H3', value: 'h3' },
  { name: 'H4', value: 'h4' },
  { name: 'H5', value: 'h5' },
  { name: 'H6', value: 'h6' },
  { name: 'Bulleted List', value: 'bullet' },
  { name: 'Numbered List', value: 'number' },
  { name: 'Check List', value: 'check' },
  { name: 'Quote', value: 'quote' }
]

const alignList = [
  { name: 'Left', value: 'left' },
  { name: 'Center', value: 'center' },
  { name: 'Right', value: 'right' },
  { name: 'Justify', value: 'justify' },
  { name: 'Start', value: 'start' },
  { name: 'End', value: 'end' }
]

const fontSizeList = [
  { name: 'Default', value: '16px' },
  { name: 'Mini', value: '12px' },
  { name: 'Small', value: '14px' },
  { name: 'Middle', value: '20px' },
  { name: 'Large', value: '24px' },
  { name: 'Huge', value: '32px' },
  { name: 'Giant', value: '48px' },
  { name: 'Massive', value: '64px' }
]

const fontFamilyList = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Lucida Console', value: 'Lucida Console' },
  { name: 'Tahoma', value: 'Tahoma' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Poppins', value: 'Poppins' }
]

function Toolbar() {
  const {
    block,
    bold,
    italic,
    underline,
    lowercase,
    uppercase,
    capitalize,
    highlight,
    strikethrough,
    code,
    link,
    align,
    fontColor,
    backgroundColor,
    fontSize,
    fontFamily,
    disabled,
    readOnly,
    formatAlign,
    formatFontColor,
    formatBackgroundColor,
    formatFontSize,
    formatFontFamily,
    formatBlock,
    formatBold,
    formatItalic,
    formatLink,
    formatUnderline,
    formatLowercase,
    formatUppercase,
    formatCapitalize,
    formatHighlight,
    formatStrikethrough,
    formatCode,
    clearFormatting
  } = useEditor()

  const blockValue = blockList.find((item) => item.value === block)?.value || 'paragraph'
  const alignValue = alignList.find((item) => item.value === align)?.value || 'left'

  if (readOnly) return <></>

  return (
    <>
      <div className='toolbar'>
        <select
          disabled={disabled}
          title='Block Type'
          value={blockValue}
          onChange={(e) => formatBlock(e.target.value as Parameters<typeof formatBlock>[0])}
        >
          {blockList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          disabled={disabled}
          title='Block alignment'
          value={alignValue}
          onChange={(e) => formatAlign(e.target.value as Parameters<typeof formatAlign>[0])}
        >
          {alignList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <select disabled={disabled} title='Font size' value={fontSize} onChange={(e) => formatFontSize(e.target.value)}>
          {fontSizeList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          disabled={disabled}
          title='Font family'
          value={fontFamily}
          onChange={(e) => formatFontFamily(e.target.value)}
        >
          {fontFamilyList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <button disabled={disabled} type='button' className={bold ? 'active' : ''} onClick={formatBold}>
          B
        </button>
        <button disabled={disabled} type='button' className={italic ? 'active' : ''} onClick={formatItalic}>
          I
        </button>
        <button disabled={disabled} type='button' className={underline ? 'active' : ''} onClick={formatUnderline}>
          U
        </button>
        <button
          disabled={disabled}
          type='button'
          className={strikethrough ? 'active' : ''}
          onClick={formatStrikethrough}
        >
          S
        </button>
        <button disabled={disabled} type='button' className={lowercase ? 'active' : ''} onClick={formatLowercase}>
          abc
        </button>
        <button disabled={disabled} type='button' className={uppercase ? 'active' : ''} onClick={formatUppercase}>
          ABC
        </button>
        <button disabled={disabled} type='button' className={capitalize ? 'active' : ''} onClick={formatCapitalize}>
          Capitalize
        </button>
        <button disabled={disabled} type='button' className={highlight ? 'active' : ''} onClick={formatHighlight}>
          Highlight
        </button>
        <input
          disabled={disabled}
          type='color'
          key='fontColor'
          value={fontColor}
          onChange={(e) => formatFontColor(e.target.value)}
        />
        <input
          disabled={disabled}
          type='color'
          key='backgroundColor'
          value={backgroundColor}
          onChange={(e) => formatBackgroundColor(e.target.value)}
        />
        <button disabled={disabled} type='button' className={code ? 'active' : ''} onClick={formatCode}>
          Code
        </button>
        <button disabled={disabled} type='button' className={link ? 'active' : ''} onClick={formatLink}>
          Link
        </button>
        <button disabled={disabled} type='button' onClick={clearFormatting}>
          Clear format
        </button>
      </div>
      <div style={{ width: '100%', height: '6px' }} />
    </>
  )
}

function Footer() {
  const { contentLength } = useEditor()
  return (
    <div className='footer'>
      <span>
        {contentLength}/{maxLength}
      </span>
    </div>
  )
}

const defaultHTMLString = `<p class="editor-paragraph" dir="ltr"><u><i><b><strong class="editor-textBold editor-textItalic editor-textUnderline" style="color: rgb(54, 40, 240); font-size: 64px; white-space: pre-wrap;">Hello world</strong></b></i></u></p>`
const defaultJSONString = `{"root":{"children":[{"children":[{"detail":0,"format":11,"mode":"normal","style":"color: #e31616;","text":"hello world2222oooo","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":11,"textStyle":"color: #e31616;"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1,"textFormat":11,"textStyle":"color: #e31616;"}}`

function App() {
  const editorRef = useRef<EditorRef>(null)

  const [readOnly, setReadOnly] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [changePayload, setChangePayload] = useState<EditorOnChangePayload>({
    value: '',
    contentSize: 0,
    empty: true,
    selection: null,
    isRangeSelection: false
  })

  console.log('changePayload', changePayload)

  const handleOnChange: EditorProps['onChange'] = (payload) => {
    setChangePayload(payload)
  }

  return (
    <>
      <Editor
        className='editor'
        namespace='playground'
        editMode='richText'
        autoFocus={{ defaultSelection: 'rootEnd' }}
        headerSlot={<Toolbar />}
        editorClassName='editor-content'
        footerSlot={<Footer />}
        outputValueSource='html'
        ignoreSelectionChange
        onChange={handleOnChange}
        readOnly={readOnly}
        disabled={disabled}
        debug={false}
        maxLength={maxLength}
        ref={editorRef}
      />
      <div className='actions'>
        <button type='button' onClick={() => setReadOnly((prev) => !prev)}>
          {readOnly ? 'On' : 'Off'} readOnly
        </button>
        <button type='button' onClick={() => setDisabled((prev) => !prev)}>
          {disabled ? 'On' : 'Off'} disabled
        </button>
        <button type='button' onClick={() => editorRef.current?.insertValue(defaultHTMLString, 'html')}>
          append html
        </button>
        <button type='button' onClick={() => editorRef.current?.insertValue(defaultJSONString, 'json')}>
          append json
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultHTMLString, 'html')}>
          update html
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultJSONString, 'json')}>
          update json
        </button>
        <button type='button' onClick={() => editorRef.current?.focus()}>
          Focus
        </button>
        <button type='button' onClick={() => editorRef.current?.blur()}>
          Blur
        </button>
        <button type='button' onClick={() => editorRef.current?.clearValue()}>
          Clear
        </button>
      </div>
    </>
  )
}

export default App
