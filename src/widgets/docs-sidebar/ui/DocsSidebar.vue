<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'

import { useFloatActions } from '../model/useFloatActions'
import DocsSidebarFloatActions from './DocsSidebarFloatActions.vue'
import DocsSidebarSection from './DocsSidebarSection.vue'
import DocsSidebarToolbar from './DocsSidebarToolbar.vue'

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

const {
  hoverTarget,
  actionPosition,
  floatGap,
  showFloatActions,
  scheduleHideFloatActions,
  keepFloatActionsOpen,
  hideFloatActionsNow,
} = useFloatActions()

const activeTaskId = computed(() => route.params.taskId as string | undefined)

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

function onFloatEdit() {
  if (!hoverTarget.value) return

  if (hoverTarget.value.type === 'section') {
    emit('edit-section', hoverTarget.value.id)
    return
  }

  emit('edit-task', hoverTarget.value.id)
}

function onFloatDelete() {
  if (!hoverTarget.value) return

  if (hoverTarget.value.type === 'section') {
    emit('delete-section', hoverTarget.value.id)
    return
  }

  emit('delete-task', hoverTarget.value.id)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-panel">
      <DocsSidebarToolbar
        @create-section="emit('create-section')"
        @create-task="emit('create-task')"
      />
      <nav class="sidebar-nav" @scroll="hideFloatActionsNow">
        <DocsSidebarSection
          v-for="section in sections"
          :key="section.id"
          :section="section"
          :tasks="tasksForSection(section.id)"
          :expanded="isExpanded(section.id)"
          :active-task-id="activeTaskId"
          @toggle="toggleSection(section.id)"
          @create-task="emit('create-task', section.id)"
          @hover="showFloatActions"
          @leave="scheduleHideFloatActions"
        />
      </nav>
    </div>

    <DocsSidebarFloatActions
      v-if="hoverTarget"
      :type="hoverTarget.type"
      :top="actionPosition.top"
      :left="actionPosition.left"
      :height="actionPosition.height"
      :float-gap="floatGap"
      @edit="onFloatEdit"
      @delete="onFloatDelete"
      @mouseenter="keepFloatActionsOpen"
      @mouseleave="scheduleHideFloatActions"
    />
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

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
