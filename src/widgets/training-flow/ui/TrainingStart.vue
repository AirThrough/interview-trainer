<script setup lang="ts">
import type { Session, SessionGrade } from '@/entities/session'

import { getGradeLabel } from '../model/useTrainingFlow'

defineProps<{
  sessions: Session[]
  canStart: boolean
  starting: boolean
}>()

const emit = defineEmits<{
  start: []
}>()

const gradeOrder: SessionGrade[] = ['perfect', 'good', 'meh', 'dont-know']

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function sessionScore(session: Session) {
  const perfect = session.answers.filter((answer) => answer.grade === 'perfect').length
  return `${perfect}/${session.taskIds.length} perfect`
}

function sessionGradeCounts(session: Session) {
  const counts: Record<SessionGrade, number> = {
    perfect: 0,
    good: 0,
    meh: 0,
    'dont-know': 0,
  }

  for (const answer of session.answers) {
    counts[answer.grade] += 1
  }

  return gradeOrder
    .filter((grade) => counts[grade] > 0)
    .map((grade) => ({ grade, count: counts[grade] }))
}
</script>

<template>
  <div class="start-panel">
    <div class="start-hero">
      <h1 class="start-title">Train</h1>
      <p class="start-text">
        Review questions one at a time, reveal the official answer, and grade yourself.
      </p>
      <button
        type="button"
        class="start-btn"
        :disabled="!canStart || starting"
        @click="emit('start')"
      >
        {{ starting ? 'Starting…' : 'Start training' }}
      </button>
      <p v-if="!canStart" class="start-hint">Add tasks in Docs before starting a session.</p>
    </div>

    <section v-if="sessions.length > 0" class="history">
      <h2 class="history-title">Past sessions</h2>
      <ul class="history-list">
        <li v-for="session in sessions" :key="session.id" class="history-item">
          <div class="history-meta">
            <span class="history-date">{{ formatDate(session.completedAt ?? session.startedAt) }}</span>
            <span class="history-score">{{ sessionScore(session) }}</span>
          </div>
          <div class="history-grades">
            <span
              v-for="item in sessionGradeCounts(session)"
              :key="item.grade"
              class="grade-pill"
              :data-grade="item.grade"
            >
              {{ getGradeLabel(item.grade) }} x{{ item.count }}
            </span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.start-panel {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.start-hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.start-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
}

.start-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.start-btn {
  align-self: flex-start;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.history-item {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--color-surface);
}

.history-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.history-date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
}

.history-score {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
}

.history-grades {
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
</style>
