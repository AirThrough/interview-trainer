<script setup lang="ts">
import { IconTooltip } from '@/shared/ui/icon-tooltip'
import IconBin from '@/shared/ui/icons/IconBin.vue'
import IconEdit from '@/shared/ui/icons/IconEdit.vue'

import type { FloatTargetType } from '../model/useFloatActions'

defineProps<{
  type: FloatTargetType
  top: string
  left: string
  height: string
  floatGap: number
}>()

const emit = defineEmits<{
  edit: []
  delete: []
  mouseenter: []
  mouseleave: []
}>()

const labels = {
  section: { edit: 'Edit section', delete: 'Delete section' },
  task: { edit: 'Edit task', delete: 'Delete task' },
} as const
</script>

<template>
  <Teleport to="body">
    <div
      class="float-actions-wrap"
      :style="{ top, left, height }"
      @mouseenter="emit('mouseenter')"
      @mouseleave="emit('mouseleave')"
    >
      <div class="float-actions-bridge" :style="{ width: `${floatGap}px` }" />
      <div class="float-actions">
        <IconTooltip :label="labels[type].edit">
          <button
            type="button"
            class="float-btn"
            :aria-label="labels[type].edit"
            @click="emit('edit')"
          >
            <IconEdit />
          </button>
        </IconTooltip>
        <IconTooltip :label="labels[type].delete">
          <button
            type="button"
            class="float-btn float-btn-danger"
            :aria-label="labels[type].delete"
            @click="emit('delete')"
          >
            <IconBin />
          </button>
        </IconTooltip>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.float-actions-wrap {
  position: fixed;
  z-index: 40;
  display: flex;
  align-items: center;
  transform: translateY(-50%);
}

.float-actions-bridge {
  align-self: stretch;
  flex-shrink: 0;
}

.float-actions {
  display: flex;
  gap: 8px;
}

.float-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.float-btn :deep(svg) {
  width: 14px;
  height: 14px;
}

.float-btn:hover {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.float-btn-danger:hover {
  background: var(--color-danger-muted);
  color: var(--color-danger);
}
</style>
