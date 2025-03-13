import { CAN_USE_DOM } from './dom'

export const IS_APPLE: boolean = CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
