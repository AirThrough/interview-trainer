<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'

const props = defineProps<{
  sections: Section[]
  tasks: Task[]
}>()

const route = useRoute()
const expandedSections = ref<Set<string>>(new Set(props.sections.map((section) => section.id)))

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
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-panel">
      <p class="sidebar-label">Browse</p>
      <nav class="sidebar-nav">
        <section v-for="section in sections" :key="section.id" class="section-group">
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
          <div v-show="isExpanded(section.id)" class="section-body">
            <RouterLink
              v-for="task in tasksForSection(section.id)"
              :key="task.id"
              :to="{ name: 'docs-task', params: { taskId: task.id } }"
              class="task-item"
              :class="{ active: activeTaskId === task.id }"
            >
              <span class="task-rail" />
              <span class="task-text">{{ task.question }}</span>
            </RouterLink>
          </div>
        </section>
      </nav>
    </div>
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

.sidebar-label {
  margin: 0 0 14px 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
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

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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
  transition:
    background 0.15s,
    height 0.15s;
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
</style>
