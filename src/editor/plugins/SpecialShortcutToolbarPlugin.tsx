import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { TextNode } from 'lexical'
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import { useEditorContext } from '../hooks'
import { SpecialShortcutMenuOption } from '../types'
import { ShortcutMenuOption } from '../model'

export interface SpecialShortcutToolbarPluginProps {
  options: Array<SpecialShortcutMenuOption>
  triggerKey: string
}

function MenuItem({
  item,
  selected,
  index,
  onClick,
  onMouseEnter,
  setHighlightedIndex,
  selectOptionAndCleanUp
}: {
  item: ShortcutMenuOption
  selected: boolean
  index: number
  onClick?: () => void
  onMouseEnter?: () => void
  setHighlightedIndex?: (index: number) => void
  selectOptionAndCleanUp?: (option: ShortcutMenuOption) => void
}) {
  const handleOnMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation()
    setHighlightedIndex?.(index)
    onMouseEnter?.()
  }

  const handleOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation()
    selectOptionAndCleanUp?.(item)
    onClick?.()
  }

  return (
    <li
      className={['montion-item', selected ? 'selected' : ''].filter(Boolean).join(' ')}
      title={[item.primaryKeyword, ...item.keywords].join(', ') || ''}
      key={item.key}
      aria-selected={selected}
      id={`montion-item-${index}`}
      ref={item.setRefElement}
      role='option'
      onMouseEnter={handleOnMouseEnter}
      onClick={handleOnClick}
      tabIndex={-1}
    >
      {item.option || <span>{item.primaryKeyword}</span>}
    </li>
  )
}

export function SpecialShortcutToolbarPlugin(props: SpecialShortcutToolbarPluginProps) {
  const { options, triggerKey } = props
  const { activeEditor } = useEditorContext()

  const [queryString, setQueryString] = useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(triggerKey, {
    minLength: 0
  })

  const finalOptions = useMemo(() => {
    const results = options.map((option) => {
      return new ShortcutMenuOption({
        primaryKeyword: option.primaryKeyword,
        option: option.option,
        keywords: option.keywords,
        onSelect: option.onSelect
      })
    })
    if (!queryString) {
      return results
    }

    const regex = new RegExp(queryString, 'i')

    return results.filter((item) => {
      return regex.test(item.primaryKeyword) || item.keywords.some((keyword) => regex.test(keyword))
    })
  }, [options, queryString])

  const handleOnQueryChange = (matchingString: string | null) => {
    setQueryString(matchingString)
  }

  const handleOnSelectOption = (
    selectedOption: ShortcutMenuOption,
    nodeToReplace: TextNode | null,
    closeMenu: () => void,
    matchingString: string | null
  ) => {
    activeEditor.update(() => {
      nodeToReplace?.remove()
      selectedOption.onSelect(matchingString)
      closeMenu()
    })
  }

  return (
    <LexicalTypeaheadMenuPlugin<ShortcutMenuOption>
      onQueryChange={handleOnQueryChange}
      onSelectOption={handleOnSelectOption}
      triggerFn={checkForTriggerMatch}
      options={finalOptions}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        return anchorElementRef.current && finalOptions.length > 0
          ? createPortal(
              <div className='lexical-special-shortcut-menu'>
                <ul>
                  {finalOptions.map((item, index) => (
                    <MenuItem
                      setHighlightedIndex={setHighlightedIndex}
                      selectOptionAndCleanUp={selectOptionAndCleanUp}
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
