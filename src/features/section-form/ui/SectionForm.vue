<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useSectionsStore } from '@/entities/section'
import { IconTooltip } from '@/shared/ui/icon-tooltip'
import IconClose from '@/shared/ui/icons/IconClose.vue'

const props = defineProps<{
  sectionId?: string | null
}>()

const emit = defineEmits<{
  saved: []
  cancelled: []
}>()

const sectionsStore = useSectionsStore()

const name = ref('')
const tagsInput = ref('')

const isEditing = computed(() => Boolean(props.sectionId))

watch(
  () => props.sectionId,
  (id) => {
    if (!id) {
      name.value = ''
      tagsInput.value = ''
      return
    }

    const section = sectionsStore.getById(id)
    if (!section) return

    name.value = section.name
    tagsInput.value = section.tags.join(', ')
  },
  { immediate: true },
)

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

async function submit() {
  const payload = {
    name: name.value,
    tags: parseTags(tagsInput.value),
  }

  if (!payload.name.trim()) return

  if (props.sectionId) {
    await sectionsStore.update(props.sectionId, payload)
  } else {
    await sectionsStore.create(payload)
  }

  emit('saved')
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submit">
    <div class="form-header">
      <h1 class="form-title">{{ isEditing ? 'Edit section' : 'New section' }}</h1>
      <IconTooltip label="Cancel">
        <button class="close-btn" type="button" aria-label="Cancel" @click="emit('cancelled')">
          <IconClose />
        </button>
      </IconTooltip>
    </div>
    <label class="field">
      <span class="label">Name</span>
      <input v-model="name" class="input" type="text" required placeholder="JavaScript Fundamentals" />
    </label>
    <label class="field">
      <span class="label">Tags</span>
      <input v-model="tagsInput" class="input" type="text" placeholder="javascript, basics" />
    </label>
    <button class="btn btn-primary" type="submit" :disabled="sectionsStore.saving">
      {{ isEditing ? 'Save section' : 'Create section' }}
    </button>
  </form>
</template>

<style scoped>
.form-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
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
