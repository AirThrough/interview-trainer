import { computed, ref } from 'vue'

import { useSectionsStore } from '@/entities/section'
import type { Session, SessionGrade } from '@/entities/session'
import { getGradeLabel, useSessionsStore } from '@/entities/session'
import { useTasksStore } from '@/entities/task'
import { shuffle } from '@/shared/lib/shuffle'

export type TrainingPhase = 'idle' | 'active' | 'complete'

export { getGradeLabel }

export function useTrainingFlow() {
  const tasksStore = useTasksStore()
  const sectionsStore = useSectionsStore()
  const sessionsStore = useSessionsStore()

  const phase = ref<TrainingPhase>('idle')
  const currentSession = ref<Session | null>(null)
  const currentIndex = ref(0)
  const answerRevealed = ref(false)
  const starting = ref(false)

  const currentTaskId = computed(() => currentSession.value?.taskIds[currentIndex.value])

  const currentTask = computed(() => {
    const taskId = currentTaskId.value
    return taskId ? tasksStore.getById(taskId) : undefined
  })

  const currentSection = computed(() => {
    if (!currentTask.value) return undefined
    return sectionsStore.getById(currentTask.value.sectionId)
  })

  const progress = computed(() => ({
    current: currentIndex.value + 1,
    total: currentSession.value?.taskIds.length ?? 0,
  }))

  const isLastQuestion = computed(() => {
    const total = currentSession.value?.taskIds.length ?? 0
    return total > 0 && currentIndex.value === total - 1
  })

  const completedSessions = computed(() =>
    sessionsStore.items.filter((session) => session.completedAt !== null),
  )

  const sessionSummary = computed(() => {
    if (!currentSession.value) return null

    const counts = {
      perfect: 0,
      good: 0,
      meh: 0,
      'dont-know': 0,
    }

    for (const answer of currentSession.value.answers) {
      counts[answer.grade] += 1
    }

    return counts
  })

  async function prepare() {
    await Promise.all([
      tasksStore.ensureLoaded(),
      sectionsStore.ensureLoaded(),
      sessionsStore.ensureLoaded(),
    ])
  }

  async function startTraining() {
    if (starting.value || tasksStore.items.length === 0) return

    starting.value = true
    try {
      await prepare()

      const taskIds = shuffle(tasksStore.items.map((task) => task.id))
      const session = await sessionsStore.create({ taskIds })

      currentSession.value = session
      currentIndex.value = 0
      answerRevealed.value = false
      phase.value = 'active'
    } finally {
      starting.value = false
    }
  }

  function revealAnswer() {
    answerRevealed.value = true
  }

  async function gradeAnswer(grade: SessionGrade) {
    if (!currentSession.value || !currentTaskId.value) return

    const session = await sessionsStore.addAnswer(currentSession.value.id, {
      taskId: currentTaskId.value,
      grade,
    })

    currentSession.value = session

    if (isLastQuestion.value) {
      const completed = await sessionsStore.complete(session.id)
      currentSession.value = completed
      phase.value = 'complete'
      return
    }

    currentIndex.value += 1
    answerRevealed.value = false
  }

  function resetToIdle() {
    phase.value = 'idle'
    currentSession.value = null
    currentIndex.value = 0
    answerRevealed.value = false
  }

  return {
    phase,
    currentSession,
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
    getGradeLabel,
  }
}
