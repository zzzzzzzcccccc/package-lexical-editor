import { useEffect } from 'react'
import { $getSelection, $isRangeSelection, $setSelection, FOCUS_COMMAND } from 'lexical'
import { useEditorContext } from '../hooks'

const COMMAND_PRIORITY_LOW = 1
const TAB_TO_FOCUS_INTERVAL = 100

let lastTabKeyDownTimestamp = 0
let hasRegisteredKeyDownListener = false

function registerKeyTimeStampTracker() {
  window.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        lastTabKeyDownTimestamp = event.timeStamp
      }
    },
    true
  )
}

export function TabFocusPlugin(): null {
  const { activeEditor } = useEditorContext()

  useEffect(() => {
    if (!hasRegisteredKeyDownListener) {
      registerKeyTimeStampTracker()
      hasRegisteredKeyDownListener = true
    }

    return activeEditor.registerCommand(
      FOCUS_COMMAND,
      (event: FocusEvent) => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          if (lastTabKeyDownTimestamp + TAB_TO_FOCUS_INTERVAL > event.timeStamp) {
            $setSelection(selection.clone())
          }
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [activeEditor])

  return null
}
