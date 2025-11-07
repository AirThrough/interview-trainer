<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useSectionsStore } from '@/entities/section'
import { useTasksStore } from '@/entities/task'
import { SelectField } from '@/shared/ui/select-field'
import { IconTooltip } from '@/shared/ui/icon-tooltip'
import IconClose from '@/shared/ui/icons/IconClose.vue'

const props = defineProps<{
  taskId?: string | null
  defaultSectionId?: string | null
}>()

const emit = defineEmits<{
  saved: [taskId: string]
  cancelled: []
}>()

const sectionsStore = useSectionsStore()
const tasksStore = useTasksStore()

const sectionId = ref('')
const question = ref('')
const answer = ref('')

const isEditing = computed(() => Boolean(props.taskId))

const sectionOptions = computed(() =>
  sectionsStore.items.map((section) => ({
    value: section.id,
    label: section.name,
  })),
)

watch(
  () => [props.taskId, props.defaultSectionId] as const,
  ([taskId, defaultSectionId]) => {
    if (taskId) {
      const task = tasksStore.getById(taskId)
      if (!task) return

      sectionId.value = task.sectionId
      question.value = task.question
      answer.value = task.answer
      return
    }

    question.value = ''
    answer.value = ''
    sectionId.value = defaultSectionId ?? sectionsStore.items[0]?.id ?? ''
  },
  { immediate: true },
)

async function submit() {
  if (!sectionId.value || !question.value.trim() || !answer.value.trim()) return

  const payload = {
    sectionId: sectionId.value,
    question: question.value,
    answer: answer.value,
  }

  if (props.taskId) {
    const task = await tasksStore.update(props.taskId, payload)
    emit('saved', task.id)
    return
  }

  const task = await tasksStore.create(payload)
  emit('saved', task.id)
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submit">
    <div class="form-header">
      <h1 class="form-title">{{ isEditing ? 'Edit task' : 'New task' }}</h1>
      <IconTooltip label="Cancel">
        <button class="close-btn" type="button" aria-label="Cancel" @click="emit('cancelled')">
          <IconClose />
        </button>
      </IconTooltip>
    </div>
    <div class="field">
      <span class="label">Section</span>
      <SelectField v-model="sectionId" :options="sectionOptions" placeholder="Choose a section" />
    </div>
    <label class="field">
      <span class="label">Question</span>
      <input v-model="question" class="input" type="text" required placeholder="What is a closure?" />
    </label>
    <label class="field">
      <span class="label">Answer</span>
      <textarea v-model="answer" class="input textarea" required rows="8" placeholder="A closure is..." />
    </label>
    <button
      class="btn btn-primary"
      type="submit"
      :disabled="tasksStore.saving || sectionsStore.items.length === 0"
    >
      {{ isEditing ? 'Save task' : 'Create task' }}
    </button>
  </form>
</template>

<style scoped>
.form-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.form-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.close-btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.close-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.9375rem;
}

.textarea {
  resize: vertical;
  min-height: 160px;
}

.input:focus {
  outline: 2px solid var(--color-accent-muted);
}

.btn {
  align-self: flex-start;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
