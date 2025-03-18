import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { LexicalTypeaheadMenuPlugin, MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { TextNode } from 'lexical'
import { useEditorContext } from '../hooks'
import { $createMentionNode } from '../nodes'
import type { EditorProps, FetchMentionOption } from '../types'

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']'

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
}

const PUNC = DocumentMentionsRegex.PUNCTUATION

const TRIGGERS = ['@'].join('')

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]'

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')'

const LENGTH_LIMIT = 75

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' + ')$'
)

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
)

class MentionOption extends MenuOption {
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

function MentionItem({
  item,
  selected = false,
  index,
  onClick,
  onMouseEnter
}: {
  item: MentionOption
  selected: boolean
  index: number
  onClick?: () => void
  onMouseEnter?: () => void
}) {
  return (
    <li
      className={['montion-item', selected ? 'selected' : ''].filter(Boolean).join(' ')}
      title={item.mentionName}
      key={item.key}
      aria-selected={selected}
      id={`montion-item-${index}`}
      ref={item.setRefElement}
      role='option'
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      tabIndex={-1}
    >
      {typeof item.selectOption === 'string' ? <span>{item.selectOption}</span> : item.selectOption()}
    </li>
  )
}

const fetchCache = new Map<string, Array<FetchMentionOption>>()

export function MentionPlugin({ fetchMention }: Pick<EditorProps, 'fetchMention'>) {
  const { activeEditor } = useEditorContext()

  const timerRef = useRef<number | null>(null)

  const [results, setResults] = useState<Array<FetchMentionOption>>([])

  const options = useMemo(() => results.map((item) => new MentionOption(item)), [results])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleOnQueryChange = (matchingString: string | null) => {
    if (matchingString) {
      const cachedData = fetchCache.get(matchingString)
      if (cachedData) {
        return setResults(cachedData)
      }
      clearTimer()
      timerRef.current = setTimeout(() => {
        fetchMention?.(matchingString).then((data) => {
          setResults(data)
          fetchCache.set(matchingString, data)
        })
      }, 100)
    } else {
      fetchMention?.(matchingString).then((data) => {
        setResults(data)
      })
    }
  }

  const handleOnSelectOption = (
    selectedOption: MentionOption,
    nodeToReplace: TextNode | null,
    closeMenu: () => void
  ) => {
    activeEditor.update(() => {
      const mentionNode = $createMentionNode({
        mentionName: selectedOption.mentionName,
        attributes: selectedOption.attributes
      })
      if (nodeToReplace) {
        nodeToReplace.replace(mentionNode)
      }
      mentionNode.select()
      closeMenu()
    })
  }

  const handleOnTriggerFn = (text: string) => {
    let match = AtSignMentionsRegex.exec(text)

    if (match === null) {
      match = AtSignMentionsRegexAliasRegex.exec(text)
    }
    if (match !== null) {
      const maybeLeadingWhitespace = match[1]
      const matchingString = match[3]

      if (matchingString.length >= 0) {
        return {
          leadOffset: match.index + maybeLeadingWhitespace.length,
          matchingString,
          replaceableString: match[2]
        }
      }
    }

    return null
  }

  useEffect(() => {
    return () => {
      clearTimer()
      fetchCache.clear()
    }
  }, [clearTimer])

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      onQueryChange={handleOnQueryChange}
      onSelectOption={handleOnSelectOption}
      triggerFn={handleOnTriggerFn}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, setHighlightedIndex, selectOptionAndCleanUp }) => {
        return anchorElementRef.current && options.length
          ? createPortal(
              <div className='lexical-mention-menu'>
                <ul>
                  {options.map((item, index) => (
                    <MentionItem
                      onClick={() => {
                        setHighlightedIndex(index)
                        selectOptionAndCleanUp(item)
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      key={item.key}
                      index={index}
                      item={item}
                      selected={selectedIndex === index}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }}
    />
  )
}
