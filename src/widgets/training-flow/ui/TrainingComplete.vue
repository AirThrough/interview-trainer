<script setup lang="ts">
import { getGradeLabel } from '../model/useTrainingFlow'

defineProps<{
  total: number
  summary: {
    perfect: number
    good: number
    meh: number
    'dont-know': number
  }
}>()

const emit = defineEmits<{
  restart: []
}>()

const gradeOrder = ['perfect', 'good', 'meh', 'dont-know'] as const
</script>

<template>
  <div class="complete-panel">
    <h1 class="complete-title">Session complete</h1>
    <p class="complete-text">You reviewed {{ total }} questions. Nice work.</p>

    <div class="summary-grid">
      <div v-for="grade in gradeOrder" :key="grade" class="summary-item" :data-grade="grade">
        <span class="summary-count">{{ summary[grade] }}</span>
        <span class="summary-label">{{ getGradeLabel(grade) }}</span>
      </div>
    </div>

    <button type="button" class="restart-btn" @click="emit('restart')">Start another session</button>
  </div>
</template>

<style scoped>
.complete-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 16px;
  background: var(--color-surface);
}

.complete-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
}

.complete-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-bg);
}

.summary-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.summary-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.summary-item[data-grade='perfect'] .summary-count {
  color: #34d399;
}

.summary-item[data-grade='good'] .summary-count {
  color: var(--color-accent);
}

.summary-item[data-grade='meh'] .summary-count {
  color: #fbbf24;
}

.summary-item[data-grade='dont-know'] .summary-count {
  color: var(--color-danger);
}

.restart-btn {
  align-self: flex-start;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
