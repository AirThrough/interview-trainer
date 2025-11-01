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
    <div class="sidebar-header">
      <h2 class="sidebar-title">Sections</h2>
    </div>
    <nav class="sidebar-nav">
      <div v-for="section in sections" :key="section.id" class="section">
        <button
          type="button"
          class="section-toggle"
          :aria-expanded="isExpanded(section.id)"
          @click="toggleSection(section.id)"
        >
          <span class="chevron" :class="{ expanded: isExpanded(section.id) }">›</span>
          <span class="section-name">{{ section.name }}</span>
          <span class="task-count">{{ tasksForSection(section.id).length }}</span>
        </button>
        <ul v-show="isExpanded(section.id)" class="task-list">
          <li v-for="task in tasksForSection(section.id)" :key="task.id">
            <RouterLink
              :to="{ name: 'docs-task', params: { taskId: task.id } }"
              class="task-link"
              :class="{ active: activeTaskId === task.id }"
            >
              {{ task.question }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 320px;
  min-width: 320px;
  border-right: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
}

.sidebar-header {
  padding: 20px 20px 12px;
}

.sidebar-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 20px;
}

.section + .section {
  margin-top: 4px;
}

.section-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}

.section-toggle:hover {
  background: var(--color-surface-hover);
}

.chevron {
  display: inline-block;
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
}

.task-count {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.task-list {
  margin: 0;
  padding: 0 0 8px 24px;
  list-style: none;
}

.task-link {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.4;
  text-decoration: none;
  transition:
    color 0.15s,
    background 0.15s;
}

.task-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.task-link.active {
  color: var(--color-accent);
  background: var(--color-accent-muted);
}
</style>
