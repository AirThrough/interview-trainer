import { ref } from 'vue'

export type FloatTargetType = 'section' | 'task'

export type FloatTarget = {
  type: FloatTargetType
  id: string
}

const FLOAT_GAP = 20
const HIDE_DELAY = 200

export function useFloatActions() {
  const hoverTarget = ref<FloatTarget | null>(null)
  const actionPosition = ref({ top: '0px', left: '0px', height: '32px' })

  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function showFloatActions(event: MouseEvent, type: FloatTargetType, id: string) {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    hoverTarget.value = { type, id }
    actionPosition.value = {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right}px`,
      height: `${Math.max(rect.height, 32)}px`,
    }
  }

  function scheduleHideFloatActions() {
    hideTimer = setTimeout(() => {
      hoverTarget.value = null
      hideTimer = null
    }, HIDE_DELAY)
  }

  function keepFloatActionsOpen() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  function hideFloatActionsNow() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    hoverTarget.value = null
  }

  return {
    hoverTarget,
    actionPosition,
    floatGap: FLOAT_GAP,
    showFloatActions,
    scheduleHideFloatActions,
    keepFloatActionsOpen,
    hideFloatActionsNow,
  }
}
