<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'
import IconPlus from '@/shared/ui/icons/IconPlus.vue'

import type { FloatTargetType } from '../model/useFloatActions'

defineProps<{
  section: Section
  tasks: Task[]
  expanded: boolean
  activeTaskId?: string
}>()

const emit = defineEmits<{
  toggle: []
  'create-task': []
  hover: [event: MouseEvent, type: FloatTargetType, id: string]
  leave: []
}>()
</script>

<template>
  <section class="section-group">
    <div
      class="section-row"
      @mouseenter="emit('hover', $event, 'section', section.id)"
      @mouseleave="emit('leave')"
    >
      <button
        type="button"
        class="section-head"
        :aria-expanded="expanded"
        @click="emit('toggle')"
      >
        <span class="chevron" :class="{ expanded }">›</span>
        <span class="section-name">{{ section.name }}</span>
        <span class="task-count">{{ tasks.length }}</span>
      </button>
    </div>
    <div v-show="expanded" class="section-body">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-row"
        @mouseenter="emit('hover', $event, 'task', task.id)"
        @mouseleave="emit('leave')"
      >
        <RouterLink
          :to="{ name: 'docs-task', params: { taskId: task.id } }"
          class="task-item"
          :class="{ active: activeTaskId === task.id }"
        >
          <span class="task-rail" />
          <span class="task-text">{{ task.question }}</span>
        </RouterLink>
      </div>
      <button type="button" class="add-task-btn" @click="emit('create-task')">
        <IconPlus />
        <span>Add task</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.section-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-row,
.task-row {
  width: 100%;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 6px 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s;
}

.section-head:hover {
  background: var(--color-surface-hover);
}

.chevron {
  flex-shrink: 0;
  width: 16px;
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1;
  transition: transform 0.15s;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.section-name {
  flex: 1;
  min-width: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.3;
  text-align: left;
}

.task-count {
  flex-shrink: 0;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  font-size: 0.6875rem;
  font-weight: 600;
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 2px 0 0 8px;
}

.task-item {
  display: flex;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  padding: 8px 10px 8px 0;
  border-radius: 0 10px 10px 0;
  color: var(--color-text-muted);
  text-decoration: none;
  transition:
    color 0.15s,
    background 0.15s;
}

.task-item:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.task-rail {
  flex-shrink: 0;
  width: 3px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  transition: background 0.15s;
}

.task-item:hover .task-rail {
  background: var(--color-text-muted);
  opacity: 0.5;
}

.task-text {
  font-size: 0.8125rem;
  line-height: 1.45;
}

.task-item.active {
  color: var(--color-accent);
  background: var(--color-accent-muted);
}

.task-item.active .task-rail {
  background: var(--color-accent);
  opacity: 1;
}

.task-item.active .task-text {
  font-weight: 600;
}

.add-task-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.add-task-btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-accent);
}

.add-task-btn :deep(svg) {
  width: 12px;
  height: 12px;
}
</style>
