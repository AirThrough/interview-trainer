<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useSessionsStore } from '@/entities/session'
import { useTasksStore } from '@/entities/task'

import { useTrainingFlow } from '@/widgets/training-flow'
import TrainingCard from '@/widgets/training-flow/ui/TrainingCard.vue'
import TrainingComplete from '@/widgets/training-flow/ui/TrainingComplete.vue'
import TrainingStart from '@/widgets/training-flow/ui/TrainingStart.vue'

const tasksStore = useTasksStore()
const sessionsStore = useSessionsStore()

const {
  phase,
  currentTask,
  currentSection,
  progress,
  answerRevealed,
  starting,
  completedSessions,
  sessionSummary,
  prepare,
  startTraining,
  revealAnswer,
  gradeAnswer,
  resetToIdle,
} = useTrainingFlow()

const canStart = computed(() => tasksStore.items.length > 0)

onMounted(() => {
  prepare()
})
</script>

<template>
  <div class="train-page">
    <TrainingStart
      v-if="phase === 'idle'"
      :sessions="completedSessions"
      :can-start="canStart"
      :starting="starting"
      @start="startTraining"
    />

    <TrainingCard
      v-else-if="phase === 'active' && currentTask"
      :task="currentTask"
      :section="currentSection"
      :progress="progress"
      :answer-revealed="answerRevealed"
      :saving="sessionsStore.saving"
      @reveal="revealAnswer"
      @grade="gradeAnswer"
    />

    <TrainingComplete
      v-else-if="phase === 'complete' && sessionSummary"
      :total="progress.total"
      :summary="sessionSummary"
      @restart="resetToIdle"
    />
  </div>
</template>

<style scoped>
.train-page {
  display: flex;
  flex: 1;
  min-height: 0;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 40px;
  overflow-y: auto;
}
</style>
