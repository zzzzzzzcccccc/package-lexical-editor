import React, { useRef, useState, Suspense } from 'react'
import {
  useEditor,
  SHORTCUTS_CONFIGURATION,
  type EditorRef,
  type EditorProps,
  type EditorOnChangePayload,
  type FetchMentionOption,
  type SpecialShortcutMenuOption,
  type VariableMenuOption
} from './editor'

import './app.scss'

const LazyEditor = React.lazy(() => import('./editor'))

const maxLength = 10000
const blockList = [
  { name: `Normal (${SHORTCUTS_CONFIGURATION.paragraph})`, value: 'passage' },
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

const MENTION_DATA = [
  { name: 'John', email: 'john@gmail.com', id: '1' },
  { name: 'Doe', email: 'doe@gmail.com', id: '2' },
  { name: 'Alice', email: 'alice@gmail.com', id: '3' },
  { name: 'Bob', email: 'bob@gmail.com', id: '4' },
  { name: 'Charlie', email: 'charlie@gmail.com', id: '5' },
  { name: 'Eve', email: 'eve@gmail.com', id: '6' },
  { name: 'Frank', email: 'frank@gmail.com', id: '7' },
  { name: 'Grace', email: 'grace@gmail.com', id: '8' },
  { name: 'Hank', email: 'hank@gmail.com', id: '9' },
  { name: 'Ivy', email: 'ivy@gmail.com', id: '10' },
  { name: 'Jack', email: 'jack@gmail.com', id: '11' },
  { name: 'Kelly', email: 'kelly@gmail.com', id: '12' },
  { name: 'Leo', email: 'leo@gmail.com', id: '13' },
  { name: 'Mia', email: 'mia@gmail.com', id: '14' },
  { name: 'Nathan', email: 'nathan@gmail.com', id: '15' },
  { name: 'Olivia', email: 'olivia@gmail.com', id: '16' },
  { name: 'Paul', email: 'paul@gmail.com', id: '17' },
  { name: 'Quincy', email: 'quincy@gmail.com', id: '18' },
  { name: 'Rachel', email: 'rachel@gmail.com', id: '19' },
  { name: 'Sam', email: 'sam@gmail.com', id: '20' },
  { name: '张三', email: 'zhangsan@gmail.com', id: '21' },
  { name: 'Tom Xu', email: 'tomxu@gmail.com', id: '22' }
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
    canRedo,
    canUndo,
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
    clearFormatting,
    undo,
    redo
  } = useEditor()

  const blockValue = blockList.find((item) => item.value === block)?.value || 'paragraph'
  const alignValue = alignList.find((item) => item.value === align)?.value || 'left'

  if (readOnly) return <></>

  return (
    <>
      <div className='toolbar'>
        <button type='button' onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button type='button' onClick={redo} disabled={!canRedo}>
          Redo
        </button>
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

function fetchMention(query: string | null): Promise<Array<FetchMentionOption>> {
  return new Promise<Array<FetchMentionOption>>((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve(
          MENTION_DATA.map((item) => ({
            mentionName: item.name,
            selectOption: `${item.name} (${item.email})`,
            attributes: JSON.stringify({ user_id: item.id, email: item.email })
          }))
        )
      } else {
        const results = MENTION_DATA.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
        resolve(
          results.map((item) => ({
            mentionName: item.name,
            selectOption: `${item.name} (${item.email})`,
            attributes: JSON.stringify({ user_id: item.id, email: item.email })
          }))
        )
      }
    }, 500)
  })
}

function imageFileToBase64(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

const defaultHTMLString = `<p class="editor-paragraph" dir="ltr"><u><i><b><strong class="editor-textBold editor-textItalic editor-textUnderline" style="color: rgb(54, 40, 240); font-size: 64px; white-space: pre-wrap;">Hello world</strong></b></i></u></p>`
const defaultJSONString = `{"root":{"children":[{"children":[{"detail":0,"format":11,"mode":"normal","style":"color: #e31616;","text":"hello world2222oooo","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":11,"textStyle":"color: #e31616;"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1,"textFormat":11,"textStyle":"color: #e31616;"}}`
const defaultText = 'Hello world'
const defaultImage = `data:image/gif;base64,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`

function App() {
  const editorRef = useRef<EditorRef>(null)

  const [readOnly, setReadOnly] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const changePayloadRef = useRef<EditorOnChangePayload | null>(null)

  const triggerSpecialShortcutMenus: SpecialShortcutMenuOption[] = [
    {
      primaryKeyword: 'Heading 1',
      keywords: ['h1', 'H1'],
      option: (
        <button type='button' className='trigger-button'>
          Heading 1
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('h1')
      }
    },
    {
      primaryKeyword: 'Heading 2',
      keywords: ['h2', 'H2'],
      option: (
        <button type='button' className='trigger-button'>
          Heading 2
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('h2')
      }
    },
    {
      primaryKeyword: 'Heading 3',
      keywords: ['h3', 'H3'],
      option: (
        <button type='button' className='trigger-button'>
          Heading 3
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('h3')
      }
    },
    {
      primaryKeyword: 'Bulleted List',
      keywords: ['list'],
      option: (
        <button type='button' className='trigger-button'>
          Bulleted List
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('bullet')
      }
    },
    {
      primaryKeyword: 'Numbered List',
      keywords: ['list'],
      option: (
        <button type='button' className='trigger-button'>
          Numbered List
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('number')
      }
    },
    {
      primaryKeyword: 'Highlight',
      keywords: ['highlight'],
      option: (
        <button type='button' className='trigger-button'>
          Highlight
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatHighlight()
      }
    },
    {
      primaryKeyword: 'Quote',
      keywords: ['quote'],
      option: (
        <button type='button' className='trigger-button'>
          Quote
        </button>
      ),
      onSelect: () => {
        editorRef.current?.formatBlock('quote')
      }
    },
    {
      primaryKeyword: 'Insert image',
      keywords: ['add image'],
      option: (
        <button type='button' className='trigger-button'>
          Insert image
        </button>
      ),
      onSelect: () => {
        editorRef.current?.insertImage({
          src: defaultImage,
          altText: 'The img alt text'
        })
      }
    }
  ]

  const variableMenus: VariableMenuOption[] = [
    {
      variable: '{{ person.name }}',
      option: <span>Person Name</span>,
      attributes: JSON.stringify({ type: 'person', key: 'name' })
    },
    {
      variable: '{{ person.age }}',
      option: <span>Person Age</span>
    },
    {
      variable: '{{ person.email }}',
      option: <span>Person Email</span>
    },
    {
      variable: '{{ person.phone }}',
      option: <span>Person Phone</span>
    },
    {
      variable: '{{ person.address }}',
      option: <span>Person Address</span>
    },
    {
      variable: '{{ person.gender }}',
      option: <span>Person Gender</span>
    },
    {
      variable: '{{ person.birthday }}',
      option: <span>Person Birthday</span>
    },
    {
      variable: '{{ person.company }}',
      option: <span>Person Company</span>
    }
  ]

  const handleOnChange: EditorProps['onChange'] = (payload) => {
    changePayloadRef.current = payload
    console.log(changePayloadRef.current)
  }

  const handleOnDragDropPasteFiles = (target: Array<File>) => {
    if (target.length === 0) return false

    console.log('onDragDropPasteFiles', target)

    const allowImageFiles = target.filter((file) => file.type.startsWith('image/') && file.size <= 1.5 * 1024 * 1024)

    if (allowImageFiles.length > 0) {
      allowImageFiles.forEach((file) => {
        imageFileToBase64(file).then((result) => {
          if (result) {
            editorRef.current?.insertImage({
              src: result,
              altText: file.name,
              attributes: JSON.stringify({ time: Date.now().toString(), action: 'drag-drop' })
            })
          }
        })
      })
      return true
    }

    return false
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
      <Suspense fallback={<div>Loading...</div>}>
        <LazyEditor
          className='editor'
          namespace='playground'
          editMode='richText'
          autoFocus={{ defaultSelection: 'rootEnd' }}
          headerSlot={<Toolbar />}
          editorClassName='editor-content'
          footerSlot={<Footer />}
          outputValueSource='html'
          fetchMention={fetchMention}
          ignoreSelectionChange
          onChange={handleOnChange}
          onDragDropPasteFiles={handleOnDragDropPasteFiles}
          readOnly={readOnly}
          disabled={disabled}
          debug={true}
          maxLength={maxLength}
          ref={editorRef}
          triggerSpecialShortcutKey='/'
          triggerSpecialShortcutMenus={triggerSpecialShortcutMenus}
          variableMenus={variableMenus}
        />
      </Suspense>
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
        <button type='button' onClick={() => editorRef.current?.insertValue(defaultText, 'text')}>
          append text
        </button>
        <button type='button' onClick={() => editorRef.current?.updateValue(defaultText, 'text')}>
          update text
        </button>
        <button
          type='button'
          onClick={() =>
            editorRef.current?.insertImage({
              src: defaultImage,
              altText: 'The img alt text',
              maxWidth: 600,
              attributes: JSON.stringify({ key: 'value', time: Date.now().toString() })
            })
          }
        >
          Insert Image
        </button>
        <button
          type='button'
          onClick={() =>
            editorRef.current?.insertMedia({
              src: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3?_=1',
              mediaType: 'audio',
              attributes: JSON.stringify({ key: 'value', time: Date.now().toString() })
            })
          }
        >
          Insert audio
        </button>
        <button
          type='button'
          onClick={() =>
            editorRef.current?.insertMedia({
              src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              mediaType: 'video',
              width: '46%',
              attributes: JSON.stringify({ key: 'value', time: Date.now().toString() })
            })
          }
        >
          Insert video
        </button>
        <button
          type='button'
          onClick={() => {
            editorRef.current?.insertIframe({
              src: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
              height: '400px'
            })
          }}
        >
          Insert iframe
        </button>
        <button type='button' onClick={() => editorRef.current?.insertVariable({ variable: `{{ var.name }}` })}>
          Insert variable
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
