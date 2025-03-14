import { useRef, useState } from 'react'
import {
  Editor,
  useEditor,
  SHORTCUTS_CONFIGURATION,
  type EditorRef,
  type EditorProps,
  type EditorOnChangePayload
} from './editor'

import './app.scss'

const maxLength = 10000
const blockList = [
  { name: `Normal (${SHORTCUTS_CONFIGURATION.paragraph})`, value: 'paragraph' },
  { name: `H1 (${SHORTCUTS_CONFIGURATION.h1})`, value: 'h1' },
  { name: `H2 (${SHORTCUTS_CONFIGURATION.h2})`, value: 'h2' },
  { name: `H3 (${SHORTCUTS_CONFIGURATION.h3})`, value: 'h3' },
  { name: `H4 (${SHORTCUTS_CONFIGURATION.h4})`, value: 'h4' },
  { name: `H5 (${SHORTCUTS_CONFIGURATION.h5})`, value: 'h5' },
  { name: `H6 (${SHORTCUTS_CONFIGURATION.h6})`, value: 'h6' },
  { name: `Bulleted List (${SHORTCUTS_CONFIGURATION.bullet})`, value: 'bullet' },
  { name: `Numbered List (${SHORTCUTS_CONFIGURATION.number})`, value: 'number' },
  { name: `Check List (${SHORTCUTS_CONFIGURATION.check})`, value: 'check' },
  { name: `Quote (${SHORTCUTS_CONFIGURATION.quote})`, value: 'quote' }
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
          B ({SHORTCUTS_CONFIGURATION.bold})
        </button>
        <button disabled={disabled} type='button' className={italic ? 'active' : ''} onClick={formatItalic}>
          I ({SHORTCUTS_CONFIGURATION.italic})
        </button>
        <button disabled={disabled} type='button' className={underline ? 'active' : ''} onClick={formatUnderline}>
          U ({SHORTCUTS_CONFIGURATION.underline})
        </button>
        <button
          disabled={disabled}
          type='button'
          className={strikethrough ? 'active' : ''}
          onClick={formatStrikethrough}
        >
          S ({SHORTCUTS_CONFIGURATION.strikeThrough})
        </button>
        <button disabled={disabled} type='button' className={lowercase ? 'active' : ''} onClick={formatLowercase}>
          abc ({SHORTCUTS_CONFIGURATION.lowercase})
        </button>
        <button disabled={disabled} type='button' className={uppercase ? 'active' : ''} onClick={formatUppercase}>
          ABC ({SHORTCUTS_CONFIGURATION.uppercase})
        </button>
        <button disabled={disabled} type='button' className={capitalize ? 'active' : ''} onClick={formatCapitalize}>
          Capitalize ({SHORTCUTS_CONFIGURATION.capitalize})
        </button>
        <button disabled={disabled} type='button' className={highlight ? 'active' : ''} onClick={formatHighlight}>
          Highlight ({SHORTCUTS_CONFIGURATION.highlight})
        </button>
        <input
          title='Update font color'
          disabled={disabled}
          type='color'
          key='fontColor'
          value={fontColor}
          onChange={(e) => formatFontColor(e.target.value)}
        />
        <input
          title='Update background color'
          disabled={disabled}
          type='color'
          key='backgroundColor'
          value={backgroundColor}
          onChange={(e) => formatBackgroundColor(e.target.value)}
        />
        <button disabled={disabled} type='button' className={code ? 'active' : ''} onClick={formatCode}>
          Code ({SHORTCUTS_CONFIGURATION.code})
        </button>
        <button disabled={disabled} type='button' className={link ? 'active' : ''} onClick={formatLink}>
          Link ({SHORTCUTS_CONFIGURATION.link})
        </button>
        <button disabled={disabled} type='button' onClick={clearFormatting}>
          Clear format ({SHORTCUTS_CONFIGURATION.clearFormatting})
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
const defaultText = 'Hello world'

function App() {
  const editorRef = useRef<EditorRef>(null)

  const [readOnly, setReadOnly] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const changePayloadRef = useRef<EditorOnChangePayload | null>(null)

  const handleOnChange: EditorProps['onChange'] = (payload) => {
    changePayloadRef.current = payload
    console.log(changePayloadRef.current)
  }

  return (
    <>
      <div className='github-corner'>
        <a href='https://github.com/zzzzzzzcccccc/package-lexical-editor' target='_blank' rel='noreferrer'>
          <svg
            width={80}
            height={80}
            viewBox='0 0 250 250'
            aria-hidden='true'
            style={{
              border: 0,
              color: 'rgb(238, 238, 238)',
              fill: 'rgb(34, 34, 34)',
              left: 0,
              position: 'absolute',
              top: 0,
              transform: 'scale(-1, 1)'
            }}
          >
            <path d='M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z' />
            <path
              d='M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2'
              fill='currentColor'
              className='octo-arm'
              style={{ transformOrigin: '130px 106px' }}
            />
            <path
              d='M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z'
              fill='currentColor'
              className='octo-body'
            />
          </svg>
        </a>
      </div>
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
        debug={true}
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
        <button type='button' onClick={() => editorRef.current?.insertValue(defaultText, 'text')}>
          append text
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultHTMLString, 'html')}>
          update html
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultJSONString, 'json')}>
          update json
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultText, 'text')}>
          update text
        </button>
        <button
          type='button'
          onClick={() =>
            editorRef.current?.insertImage({
              src: 'https://playground.lexical.dev/assets/yellow-flower-vav9Hsve.jpg',
              altText: 'Yellow Flower',
              maxWidth: 600,
              attributes: JSON.stringify({ key: 'value', time: Date.now().toString() })
            })
          }
        >
          Insert Image
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
