import { createCommand, type EditorThemeClasses } from 'lexical'
import { IS_APPLE } from '../utils/device'

export const INLINE_CSS_STYLE_ID = '__editor-inline-css'

export const EDIT_MODE = {
  text: 'text',
  richText: 'richText'
} as const

export const DEFAULT_THEME: EditorThemeClasses = {
  autocomplete: 'editor-autocomplete',
  blockCursor: 'editor-blockCursor',
  characterLimit: 'editor-characterLimit',
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable'
  },
  embedBlock: {
    base: 'editor-embedBlock',
    focus: 'editor-embedBlockFocus'
  },
  hashtag: 'editor-hashtag',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
    h4: 'editor-h4',
    h5: 'editor-h5',
    h6: 'editor-h6'
  },
  hr: 'editor-hr',
  hrSelected: 'editor-hrSelected',
  image: 'editor-image',
  media: 'editor-media',
  mention: 'editor-mention',
  indent: 'editor-indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'editor-layoutContainer',
  layoutItem: 'editor-layoutItem',
  link: 'editor-link',
  list: {
    checklist: 'editor-checklist',
    listitem: 'editor-listItem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked',
    nested: {
      listitem: 'editor-nestedListItem'
    },
    olDepth: ['editor-ol1', 'editor-ol2', 'editor-ol3', 'editor-ol4', 'editor-ol5'],
    ul: 'editor-ul'
  },
  ltr: 'editor-ltr',
  mark: 'editor-mark',
  markOverlap: 'editor-markOverlap',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  rtl: 'editor-rtl',
  specialText: 'editor-specialText',
  tab: 'editor-tabNode',
  table: 'editor-table',
  tableAddColumns: 'editor-tableAddColumns',
  tableAddRows: 'editor-tableAddRows',
  tableAlignment: {
    center: 'editor-tableAlignmentCenter',
    right: 'editor-tableAlignmentRight'
  },
  tableCell: 'editor-tableCell',
  tableCellActionButton: 'editor-tableCellActionButton',
  tableCellActionButtonContainer: 'editor-tableCellActionButtonContainer',
  tableCellHeader: 'editor-tableCellHeader',
  tableCellResizer: 'editor-tableCellResizer',
  tableCellSelected: 'editor-tableCellSelected',
  tableFrozenColumn: 'editor-tableFrozenColumn',
  tableFrozenRow: 'editor-tableFrozenRow',
  tableRowStriping: 'editor-tableRowStriping',
  tableScrollableWrapper: 'editor-tableScrollableWrapper',
  tableSelected: 'editor-tableSelected',
  tableSelection: 'editor-tableSelection',
  text: {
    bold: 'editor-textBold',
    capitalize: 'editor-textCapitalize',
    code: 'editor-textCode',
    highlight: 'editor-textHighlight',
    italic: 'editor-textItalic',
    lowercase: 'editor-textLowercase',
    strikethrough: 'editor-textStrikethrough',
    subscript: 'editor-textSubscript',
    superscript: 'editor-textSuperscript',
    underline: 'editor-textUnderline',
    underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    uppercase: 'editor-textUppercase'
  }
}

export const BLOCK = {
  root: 'Root',
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote'
} as const

export const ALIGN = {
  left: 'left',
  start: 'start',
  center: 'center',
  right: 'right',
  end: 'end',
  justify: 'justify'
} as const

export const VALUE_SOURCE = {
  json: 'json',
  html: 'html'
}

export const SHORTCUTS_CONFIGURATION = {
  bold: IS_APPLE ? '⌘+B' : 'Ctrl+B',
  italic: IS_APPLE ? '⌘+I' : 'Ctrl+I',
  underline: IS_APPLE ? '⌘+U' : 'Ctrl+U',
  paragraph: IS_APPLE ? '⌘+Opt+0' : 'Ctrl+Alt+0',
  h1: IS_APPLE ? '⌘+Opt+1' : 'Ctrl+Alt+1',
  h2: IS_APPLE ? '⌘+Opt+2' : 'Ctrl+Alt+2',
  h3: IS_APPLE ? '⌘+Opt+3' : 'Ctrl+Alt+3',
  h4: IS_APPLE ? '⌘+Opt+4' : 'Ctrl+Alt+4',
  h5: IS_APPLE ? '⌘+Opt+5' : 'Ctrl+Alt+5',
  h6: IS_APPLE ? '⌘+Opt+6' : 'Ctrl+Alt+6',
  bullet: IS_APPLE ? '⌘+Opt+7' : 'Ctrl+Alt+7',
  number: IS_APPLE ? '⌘+Opt+8' : 'Ctrl+Alt+8',
  check: IS_APPLE ? '⌘+Opt+9' : 'Ctrl+Alt+9',
  quote: IS_APPLE ? '⌘+Opt+Q' : 'Ctrl+Alt+Q',
  code: IS_APPLE ? '⌘+Opt+C' : 'Ctrl+Alt+C',
  lowercase: IS_APPLE ? '⌘+Shift+1' : 'Ctrl+Shift+1',
  uppercase: IS_APPLE ? '⌘+Shift+2' : 'Ctrl+Shift+2',
  capitalize: IS_APPLE ? '⌘+Shift+3' : 'Ctrl+Shift+3',
  strikeThrough: IS_APPLE ? '⌘+Shift+S' : 'Ctrl+Shift+S',
  highlight: IS_APPLE ? '⌘+Shift+H' : 'Ctrl+Shift+H',
  clearFormatting: IS_APPLE ? '⌘+\\' : 'Ctrl+\\',
  link: IS_APPLE ? '⌘+K' : 'Ctrl+K'
}

export const CUSTOMER_LEXICAL_COMMAND = {
  insertImage: createCommand('INSERT_IMAGE_COMMAND'),
  insertMedia: createCommand('INSERT_MEDIA_COMMAND'),
  insertIframe: createCommand('INSERT_IFRAME_COMMAND')
}

export const MEDIA_NODE_TYPE = {
  video: 'video',
  audio: 'audio'
} as const
