<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { DocsSidebar } from '@/widgets/docs-sidebar'
import { getSectionById, getTaskById, mockSections, mockTasks } from '@/shared/api/mock'

const route = useRoute()

const activeTask = computed(() => {
  const taskId = route.params.taskId as string | undefined
  return taskId ? getTaskById(taskId) : undefined
})

const activeSection = computed(() => {
  if (!activeTask.value) return undefined
  return getSectionById(activeTask.value.sectionId)
})
</script>

<template>
  <div class="docs-page">
    <DocsSidebar :sections="mockSections" :tasks="mockTasks" />
    <main class="content">
      <div v-if="activeTask" class="task-view">
        <div v-if="activeSection" class="task-meta">
          <span class="section-label">{{ activeSection.name }}</span>
          <div class="tags">
            <span v-for="tag in activeSection.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <h1 class="question">{{ activeTask.question }}</h1>
        <div class="answer-block">
          <h2 class="answer-label">Answer</h2>
          <p class="answer">{{ activeTask.answer }}</p>
        </div>
      </div>
      <div v-else class="empty-state">
        <h1 class="empty-title">Documentation</h1>
        <p class="empty-text">Select a task from the sidebar to view its question and answer.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.docs-page {
  display: flex;
  flex: 1;
  min-height: 0;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
}

.task-view {
  max-width: 720px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.question {
  margin: 0 0 28px;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text);
}

.answer-block {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface);
}

.answer-label {
  margin: 0 0 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.answer {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text);
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 480px;
  min-height: 100%;
}

.empty-title {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.empty-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
