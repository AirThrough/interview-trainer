<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSectionsStore } from '@/entities/section'
import { useTasksStore } from '@/entities/task'
import { SectionForm } from '@/features/section-form'
import { TaskForm } from '@/features/task-form'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { DocsSidebar } from '@/widgets/docs-sidebar'

type PanelMode = 'view' | 'section-form' | 'task-form'

type ConfirmRequest = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => Promise<void>
}

const route = useRoute()
const router = useRouter()
const sectionsStore = useSectionsStore()
const tasksStore = useTasksStore()

const panelMode = ref<PanelMode>('view')
const editingSectionId = ref<string | null>(null)
const editingTaskId = ref<string | null>(null)
const defaultTaskSectionId = ref<string | null>(null)
const confirmOpen = ref(false)
const confirmRequest = ref<ConfirmRequest | null>(null)

onMounted(() => {
  sectionsStore.ensureLoaded()
  tasksStore.ensureLoaded()
})

watch(
  () => route.params.taskId,
  () => {
    if (panelMode.value !== 'view') {
      closeForm()
    }
  },
)

const activeTask = computed(() => {
  const taskId = route.params.taskId as string | undefined
  return taskId ? tasksStore.getById(taskId) : undefined
})

const activeSection = computed(() => {
  if (!activeTask.value) return undefined
  return sectionsStore.getById(activeTask.value.sectionId)
})

function openSectionForm(sectionId?: string) {
  panelMode.value = 'section-form'
  editingSectionId.value = sectionId ?? null
}

function openTaskForm(taskId?: string, sectionId?: string) {
  panelMode.value = 'task-form'
  editingTaskId.value = taskId ?? null
  defaultTaskSectionId.value = sectionId ?? null
}

function closeForm() {
  panelMode.value = 'view'
  editingSectionId.value = null
  editingTaskId.value = null
  defaultTaskSectionId.value = null
}

function onSectionSaved() {
  closeForm()
}

function onTaskSaved(taskId: string) {
  closeForm()
  router.push({ name: 'docs-task', params: { taskId } })
}

function openConfirm(request: ConfirmRequest) {
  confirmRequest.value = request
  confirmOpen.value = true
}

function closeConfirm() {
  confirmOpen.value = false
  confirmRequest.value = null
}

async function handleConfirm() {
  const request = confirmRequest.value
  if (!request) return

  await request.onConfirm()
  closeConfirm()
}

function requestDeleteSection(sectionId: string) {
  const section = sectionsStore.getById(sectionId)
  if (!section) return

  openConfirm({
    title: 'Delete section',
    message: `Delete "${section.name}" and all tasks inside it? This cannot be undone.`,
    confirmLabel: 'Delete section',
    onConfirm: () => deleteSectionConfirmed(sectionId),
  })
}

function requestDeleteTask(taskId: string) {
  const task = tasksStore.getById(taskId)
  if (!task) return

  openConfirm({
    title: 'Delete task',
    message: `Delete "${task.question}"? This cannot be undone.`,
    confirmLabel: 'Delete task',
    onConfirm: () => deleteTaskConfirmed(taskId),
  })
}

async function deleteSectionConfirmed(sectionId: string) {
  await sectionsStore.remove(sectionId)
  tasksStore.removeBySectionId(sectionId)

  if (editingSectionId.value === sectionId) {
    closeForm()
  }

  if (activeTask.value?.sectionId === sectionId) {
    router.push({ name: 'docs' })
  }
}

async function deleteTaskConfirmed(taskId: string) {
  await tasksStore.remove(taskId)

  if (editingTaskId.value === taskId) {
    closeForm()
  }

  if (route.params.taskId === taskId) {
    router.push({ name: 'docs' })
  }
}
</script>

<template>
  <div class="docs-page">
    <DocsSidebar
      :sections="sectionsStore.items"
      :tasks="tasksStore.items"
      @create-section="openSectionForm()"
      @edit-section="openSectionForm"
      @delete-section="requestDeleteSection"
      @create-task="openTaskForm(undefined, $event)"
      @edit-task="openTaskForm($event)"
      @delete-task="requestDeleteTask"
    />
    <main class="content">
      <SectionForm
        v-if="panelMode === 'section-form'"
        :section-id="editingSectionId"
        @saved="onSectionSaved"
        @cancelled="closeForm"
      />
      <TaskForm
        v-else-if="panelMode === 'task-form'"
        :task-id="editingTaskId"
        :default-section-id="defaultTaskSectionId"
        @saved="onTaskSaved"
        @cancelled="closeForm"
      />
      <div v-else-if="activeTask" class="task-view">
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

    <ConfirmDialog
      :open="confirmOpen"
      :title="confirmRequest?.title ?? ''"
      :message="confirmRequest?.message ?? ''"
      :confirm-label="confirmRequest?.confirmLabel"
      destructive
      @confirm="handleConfirm"
      @cancel="closeConfirm"
    />
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
