<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useSectionsStore } from '@/entities/section'
import {
  formatSessionDate,
  getGradeLabel,
  sessionGradeCounts,
  sessionScore,
  useSessionsStore,
} from '@/entities/session'
import { useTasksStore } from '@/entities/task'

const route = useRoute()
const router = useRouter()
const sessionsStore = useSessionsStore()
const tasksStore = useTasksStore()
const sectionsStore = useSectionsStore()

onMounted(() => {
  sessionsStore.ensureLoaded()
  tasksStore.ensureLoaded()
  sectionsStore.ensureLoaded()
})

const completedSessions = computed(() =>
  sessionsStore.items.filter((session) => session.completedAt !== null),
)

const activeSession = computed(() => {
  const sessionId = route.params.sessionId as string | undefined
  if (!sessionId) return undefined
  return completedSessions.value.find((session) => session.id === sessionId)
})

const answerRows = computed(() => {
  if (!activeSession.value) return []

  return activeSession.value.answers.map((answer) => {
    const task = tasksStore.getById(answer.taskId)
    const section = task ? sectionsStore.getById(task.sectionId) : undefined
    return { answer, task, section }
  })
})

function selectSession(sessionId: string) {
  router.push({ name: 'sessions-detail', params: { sessionId } })
}
</script>

<template>
  <div class="sessions-page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Sessions</h1>
        <p class="sidebar-text">Full training history</p>
      </div>

      <div v-if="completedSessions.length === 0" class="sidebar-empty">
        <p class="sidebar-empty-text">No sessions yet.</p>
        <RouterLink to="/train" class="sidebar-empty-link">Start training</RouterLink>
      </div>

      <ul v-else class="session-list">
        <li v-for="session in completedSessions" :key="session.id">
          <button
            type="button"
            class="session-item"
            :class="{ active: activeSession?.id === session.id }"
            @click="selectSession(session.id)"
          >
            <div class="session-meta">
              <span class="session-date">{{
                formatSessionDate(session.completedAt ?? session.startedAt)
              }}</span>
              <span class="session-score">{{ sessionScore(session) }}</span>
            </div>
            <div class="session-grades">
              <span
                v-for="item in sessionGradeCounts(session)"
                :key="item.grade"
                class="grade-pill"
                :data-grade="item.grade"
              >
                {{ getGradeLabel(item.grade) }} x{{ item.count }}
              </span>
            </div>
          </button>
        </li>
      </ul>
    </aside>

    <main class="content">
      <div v-if="activeSession" class="session-detail">
        <div class="detail-header">
          <p class="detail-date">
            {{ formatSessionDate(activeSession.completedAt ?? activeSession.startedAt) }}
          </p>
          <h2 class="detail-title">{{ sessionScore(activeSession) }}</h2>
          <div class="session-grades">
            <span
              v-for="item in sessionGradeCounts(activeSession)"
              :key="item.grade"
              class="grade-pill"
              :data-grade="item.grade"
            >
              {{ getGradeLabel(item.grade) }} x{{ item.count }}
            </span>
          </div>
        </div>

        <ul class="answer-list">
          <li v-for="row in answerRows" :key="row.answer.taskId" class="answer-item">
            <div class="answer-top">
              <span v-if="row.section" class="answer-section">{{ row.section.name }}</span>
              <span class="grade-pill" :data-grade="row.answer.grade">
                {{ getGradeLabel(row.answer.grade) }}
              </span>
            </div>
            <h3 class="answer-question">
              {{ row.task?.question ?? 'Deleted task' }}
            </h3>
            <p v-if="row.task" class="answer-text">{{ row.task.answer }}</p>
          </li>
        </ul>
      </div>

      <div v-else class="empty-state">
        <h2 class="empty-title">Session history</h2>
        <p class="empty-text">
          {{
            completedSessions.length > 0
              ? 'Select a session to review questions and grades.'
              : 'Complete a training session to see it here.'
          }}
        </p>
        <RouterLink v-if="completedSessions.length === 0" to="/train" class="empty-link">
          Go to Train
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sessions-page {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 320px;
  flex-shrink: 0;
  padding: 24px 16px;
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
}

.sidebar-header {
  padding: 0 8px;
}

.sidebar-title {
  margin: 0 0 6px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.sidebar-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.sidebar-empty {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
}

.sidebar-empty-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.sidebar-empty-link,
.empty-link {
  align-self: flex-start;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
}

.sidebar-empty-link:hover,
.empty-link:hover {
  text-decoration: underline;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 14px 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.session-item:hover {
  background: var(--color-surface-hover);
}

.session-item.active {
  background: var(--color-surface);
  border-color: var(--color-border);
}

.session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.session-date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
}

.session-score {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
}

.session-grades {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.grade-pill {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.grade-pill[data-grade='perfect'] {
  background: rgba(52, 211, 153, 0.14);
  color: #34d399;
}

.grade-pill[data-grade='good'] {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.grade-pill[data-grade='meh'] {
  background: rgba(251, 191, 36, 0.14);
  color: #fbbf24;
}

.grade-pill[data-grade='dont-know'] {
  background: var(--color-danger-muted);
  color: var(--color-danger);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
}

.session-detail {
  max-width: 720px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.detail-date {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.detail-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.answer-item {
  padding: 18px 20px;
  border-radius: 12px;
  background: var(--color-surface);
}

.answer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.answer-section {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
}

.answer-question {
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
}

.answer-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  max-width: 480px;
  min-height: 100%;
}

.empty-title {
  margin: 0;
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

@media (max-width: 800px) {
  .sessions-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    max-height: 40vh;
  }

  .content {
    padding: 24px 20px;
  }
}
</style>
