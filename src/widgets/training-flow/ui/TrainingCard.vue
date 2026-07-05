<script setup lang="ts">
import type { Section } from '@/entities/section'
import type { SessionGrade } from '@/entities/session'
import type { Task } from '@/entities/task'

const props = defineProps<{
  task: Task
  section?: Section
  progress: { current: number; total: number }
  answerRevealed: boolean
  saving: boolean
}>()

const emit = defineEmits<{
  reveal: []
  grade: [grade: SessionGrade]
}>()

const grades: { value: SessionGrade; label: string }[] = [
  { value: 'perfect', label: 'Perfect' },
  { value: 'good', label: 'Good' },
  { value: 'meh', label: 'Meh' },
  { value: 'dont-know', label: "Don't know" },
]
</script>

<template>
  <div class="card-panel">
    <div class="card-header">
      <span v-if="section" class="section-label">{{ section.name }}</span>
      <span class="progress-label">{{ progress.current }} / {{ progress.total }}</span>
    </div>

    <h2 class="question">{{ task.question }}</h2>

    <div class="actions">
      <button
        type="button"
        class="reveal-btn"
        :disabled="answerRevealed"
        @click="emit('reveal')"
      >
        {{ answerRevealed ? 'Answer revealed' : 'Show answer' }}
      </button>
    </div>

    <div v-if="answerRevealed" class="answer-block">
      <h3 class="answer-label">Official answer</h3>
      <p class="answer">{{ task.answer }}</p>
    </div>

    <div class="grade-block">
      <p class="grade-label">How did you do?</p>
      <div class="grade-actions">
        <button
          v-for="grade in grades"
          :key="grade.value"
          type="button"
          class="grade-btn"
          :data-grade="grade.value"
          :disabled="saving"
          @click="emit('grade', grade.value)"
        >
          {{ grade.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 720px;
  padding: 28px;
  border-radius: 16px;
  background: var(--color-surface);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-accent);
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.question {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text);
}

.actions {
  display: flex;
}

.reveal-btn {
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.reveal-btn:hover:not(:disabled) {
  background: var(--color-surface-hover);
  border-color: var(--color-accent);
}

.reveal-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.answer-block {
  padding: 20px;
  border-radius: 12px;
  background: var(--color-bg);
}

.answer-label {
  margin: 0 0 10px;
  font-size: 0.75rem;
  font-weight: 700;
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

.grade-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.grade-label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.grade-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.grade-btn {
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.grade-btn:hover:not(:disabled) {
  background: var(--color-surface-hover);
}

.grade-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.grade-btn[data-grade='perfect']:hover:not(:disabled) {
  border-color: #34d399;
  color: #34d399;
}

.grade-btn[data-grade='good']:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.grade-btn[data-grade='meh']:hover:not(:disabled) {
  border-color: #fbbf24;
  color: #fbbf24;
}

.grade-btn[data-grade='dont-know']:hover:not(:disabled) {
  border-color: var(--color-danger);
  color: var(--color-danger);
}
</style>
