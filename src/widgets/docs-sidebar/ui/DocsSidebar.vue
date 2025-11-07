<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'
import { IconTooltip } from '@/shared/ui/icon-tooltip'
import IconBin from '@/shared/ui/icons/IconBin.vue'
import IconEdit from '@/shared/ui/icons/IconEdit.vue'
import IconPlus from '@/shared/ui/icons/IconPlus.vue'

type HoverTarget = {
  type: 'section' | 'task'
  id: string
}

const props = defineProps<{
  sections: Section[]
  tasks: Task[]
}>()

const emit = defineEmits<{
  'create-section': []
  'edit-section': [sectionId: string]
  'delete-section': [sectionId: string]
  'create-task': [sectionId?: string]
  'edit-task': [taskId: string]
  'delete-task': [taskId: string]
}>()

const route = useRoute()
const expandedSections = ref<Set<string>>(new Set(props.sections.map((section) => section.id)))
const hoverTarget = ref<HoverTarget | null>(null)
const actionPosition = ref({ top: '0px', left: '0px', height: '32px' })

const FLOAT_GAP = 20
const HIDE_DELAY = 200

let hideTimer: ReturnType<typeof setTimeout> | null = null

const activeTaskId = computed(() => route.params.taskId as string | undefined)

const hoveredSection = computed(() => {
  if (hoverTarget.value?.type !== 'section') return null
  return props.sections.find((section) => section.id === hoverTarget.value?.id) ?? null
})

const hoveredTask = computed(() => {
  if (hoverTarget.value?.type !== 'task') return null
  return props.tasks.find((task) => task.id === hoverTarget.value?.id) ?? null
})

function tasksForSection(sectionId: string) {
  return props.tasks.filter((task) => task.sectionId === sectionId)
}

function toggleSection(sectionId: string) {
  const next = new Set(expandedSections.value)
  if (next.has(sectionId)) {
    next.delete(sectionId)
  } else {
    next.add(sectionId)
  }
  expandedSections.value = next
}

function isExpanded(sectionId: string) {
  return expandedSections.value.has(sectionId)
}

function showFloatActions(event: MouseEvent, type: HoverTarget['type'], id: string) {
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

function onSidebarScroll() {
  hideFloatActionsNow()
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-panel">
      <div class="sidebar-toolbar">
        <p class="sidebar-label">Browse</p>
        <Menu v-slot="{ open }" as="div" class="add-menu">
          <MenuButton class="add-menu-btn" aria-label="Add">
            <IconPlus />
            <span class="menu-chevron" :class="{ open }">›</span>
          </MenuButton>
          <transition
            enter-active-class="menu-enter-active"
            enter-from-class="menu-enter-from"
            enter-to-class="menu-enter-to"
            leave-active-class="menu-leave-active"
            leave-from-class="menu-leave-from"
            leave-to-class="menu-leave-to"
          >
            <MenuItems class="add-menu-items">
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="menu-item"
                  :class="{ 'menu-item-active': active }"
                  @click="emit('create-section')"
                >
                  Add section
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="menu-item"
                  :class="{ 'menu-item-active': active }"
                  @click="emit('create-task')"
                >
                  Add task
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
      <nav class="sidebar-nav" @scroll="onSidebarScroll">
        <section v-for="section in sections" :key="section.id" class="section-group">
          <div
            class="section-row"
            @mouseenter="showFloatActions($event, 'section', section.id)"
            @mouseleave="scheduleHideFloatActions"
          >
            <button
              type="button"
              class="section-head"
              :aria-expanded="isExpanded(section.id)"
              @click="toggleSection(section.id)"
            >
              <span class="chevron" :class="{ expanded: isExpanded(section.id) }">›</span>
              <span class="section-name">{{ section.name }}</span>
              <span class="task-count">{{ tasksForSection(section.id).length }}</span>
            </button>
          </div>
          <div v-show="isExpanded(section.id)" class="section-body">
            <div
              v-for="task in tasksForSection(section.id)"
              :key="task.id"
              class="task-row"
              @mouseenter="showFloatActions($event, 'task', task.id)"
              @mouseleave="scheduleHideFloatActions"
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
            <button type="button" class="add-task-btn" @click="emit('create-task', section.id)">
              <IconPlus />
              <span>Add task</span>
            </button>
          </div>
        </section>
      </nav>
    </div>

    <Teleport to="body">
      <div
        v-if="hoveredSection"
        class="float-actions-wrap"
        :style="{
          top: actionPosition.top,
          left: actionPosition.left,
          height: actionPosition.height,
        }"
        @mouseenter="keepFloatActionsOpen"
        @mouseleave="scheduleHideFloatActions"
      >
        <div class="float-actions-bridge" :style="{ width: `${FLOAT_GAP}px` }" />
        <div class="float-actions">
          <IconTooltip label="Edit section">
            <button
              type="button"
              class="float-btn"
              aria-label="Edit section"
              @click="emit('edit-section', hoveredSection.id)"
            >
              <IconEdit />
            </button>
          </IconTooltip>
          <IconTooltip label="Delete section">
            <button
              type="button"
              class="float-btn float-btn-danger"
              aria-label="Delete section"
              @click="emit('delete-section', hoveredSection.id)"
            >
              <IconBin />
            </button>
          </IconTooltip>
        </div>
      </div>

      <div
        v-if="hoveredTask"
        class="float-actions-wrap"
        :style="{
          top: actionPosition.top,
          left: actionPosition.left,
          height: actionPosition.height,
        }"
        @mouseenter="keepFloatActionsOpen"
        @mouseleave="scheduleHideFloatActions"
      >
        <div class="float-actions-bridge" :style="{ width: `${FLOAT_GAP}px` }" />
        <div class="float-actions">
          <IconTooltip label="Edit task">
            <button
              type="button"
              class="float-btn"
              aria-label="Edit task"
              @click="emit('edit-task', hoveredTask.id)"
            >
              <IconEdit />
            </button>
          </IconTooltip>
          <IconTooltip label="Delete task">
            <button
              type="button"
              class="float-btn float-btn-danger"
              aria-label="Delete task"
              @click="emit('delete-task', hoveredTask.id)"
            >
              <IconBin />
            </button>
          </IconTooltip>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 300px;
  min-width: 300px;
  padding: 16px 12px 16px 16px;
  background: var(--color-bg);
}

.sidebar-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 18px 14px;
  border-radius: 16px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
}

.sidebar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.sidebar-label {
  margin: 0 0 0 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.add-menu {
  position: relative;
}

.add-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  min-width: 44px;
  padding: 0 10px 0 8px;
  border: none;
  border-radius: 8px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.add-menu-btn:hover {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.add-menu-btn :deep(svg) {
  width: 14px;
  height: 14px;
}

.menu-chevron {
  font-size: 0.875rem;
  line-height: 1;
  transform: rotate(90deg);
  transition: transform 0.15s ease;
}

.menu-chevron.open {
  transform: rotate(-90deg);
}

.add-menu-items {
  position: absolute;
  right: 0;
  top: calc(100% + 2px);
  z-index: 20;
  min-width: 148px;
  padding: 6px;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
  outline: none;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.menu-item-active,
.menu-item:hover {
  background: var(--color-surface-hover);
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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
