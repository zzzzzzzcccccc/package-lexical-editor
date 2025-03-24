import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type { FetchMentionOption, SpecialShortcutMenuOption } from '../types'

export class MentionOption extends MenuOption {
  mentionName: string
  selectOption: string | (() => React.ReactNode)
  attributes?: string | null

  constructor(item: FetchMentionOption) {
    super(item.mentionName)

    this.mentionName = item.mentionName
    this.selectOption = item.selectOption
    this.attributes = item.attributes || null
  }
}

export class ShortcutMenuOption extends MenuOption {
  primaryKeyword: string
  option: React.ReactNode
  keywords: Array<string>
  onSelect: (query: string | null) => void

  constructor(item: SpecialShortcutMenuOption) {
    super(item.primaryKeyword)

    this.primaryKeyword = item.primaryKeyword
    this.option = item.option
    this.keywords = item.keywords
    this.onSelect = item.onSelect.bind(this)
  }
}
