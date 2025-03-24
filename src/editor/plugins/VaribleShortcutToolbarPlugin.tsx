import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useBasicTypeaheadTriggerMatch, LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import { VariableMenuOption } from '../types'
import { VariableOption } from '../model'
import { useEditorContext } from '../hooks'
import { TextNode } from 'lexical'
import { $createVariableNode } from '../nodes'

export type VaribleShortcutToolbarPluginProps = {
  options: Array<VariableMenuOption>
}

function MenuItem({
  item,
  selected = false,
  index,
  onClick,
  onMouseEnter,
  setHighlightedIndex,
  selectOptionAndCleanUp
}: {
  item: VariableOption
  selected: boolean
  index: number
  onClick?: () => void
  onMouseEnter?: () => void
  setHighlightedIndex?: (index: number) => void
  selectOptionAndCleanUp?: (option: VariableOption) => void
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
      className={['variable-item', selected ? 'selected' : ''].filter(Boolean).join(' ')}
      title={item.variable}
      key={item.key}
      aria-selected={selected}
      id={`variable-item-${index}`}
      ref={item.setRefElement}
      role='option'
      onMouseEnter={handleOnMouseEnter}
      onClick={handleOnClick}
      tabIndex={-1}
    >
      {item.option}
    </li>
  )
}

export function VaribleShortcutToolbarPlugin(props: VaribleShortcutToolbarPluginProps) {
  const { options } = props
  const [queryString, setQueryString] = useState<string | null>(null)

  const { activeEditor } = useEditorContext()
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('$', { minLength: 0 })

  const finalOptions = useMemo(() => {
    const results = options.map((option) => {
      return new VariableOption(option)
    })
    if (!queryString) {
      return results
    }
    return results.filter((option) => {
      return option.variable.toLowerCase().includes(queryString.toLowerCase())
    })
  }, [options, queryString])

  const handleOnQueryChange = (matchingString: string | null) => {
    setQueryString(matchingString)
  }

  const handleOnSelectOption = (
    selectedOption: VariableOption,
    nodeToReplace: TextNode | null,
    closeMenu: () => void
  ) => {
    activeEditor.update(() => {
      const variableNode = $createVariableNode({
        variable: selectedOption.variable,
        attributes: selectedOption.attributes
      })
      if (nodeToReplace) {
        nodeToReplace.replace(variableNode)
      }
      variableNode.select()
      closeMenu()
    })
  }

  return (
    <LexicalTypeaheadMenuPlugin<VariableOption>
      onQueryChange={handleOnQueryChange}
      onSelectOption={handleOnSelectOption}
      options={finalOptions}
      triggerFn={checkForTriggerMatch}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        return anchorElementRef.current && finalOptions.length > 0
          ? createPortal(
              <div className='lexical-variable-menu'>
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
