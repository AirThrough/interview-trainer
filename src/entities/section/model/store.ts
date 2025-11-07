import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Section } from '@/entities/section'
import {
  createSection,
  deleteSection,
  fetchSections,
  updateSection,
  type CreateSectionPayload,
  type UpdateSectionPayload,
} from '@/shared/api/mock'

export const useSectionsStore = defineStore('sections', () => {
  const items = ref<Section[]>([])
  const loaded = ref(false)
  const saving = ref(false)

  const byId = computed(() => {
    return Object.fromEntries(items.value.map((section) => [section.id, section]))
  })

  async function load() {
    items.value = await fetchSections()
    loaded.value = true
  }

  async function ensureLoaded() {
    if (!loaded.value) {
      await load()
    }
  }

  function getById(id: string) {
    return byId.value[id]
  }

  async function create(payload: CreateSectionPayload) {
    saving.value = true
    try {
      const section = await createSection(payload)
      items.value = [...items.value, section]
      return section
    } finally {
      saving.value = false
    }
  }

  async function update(id: string, payload: UpdateSectionPayload) {
    saving.value = true
    try {
      const section = await updateSection(id, payload)
      items.value = items.value.map((item) => (item.id === id ? section : item))
      return section
    } finally {
      saving.value = false
    }
  }

  async function remove(id: string) {
    saving.value = true
    try {
      await deleteSection(id)
      items.value = items.value.filter((item) => item.id !== id)
    } finally {
      saving.value = false
    }
  }

  return {
    items,
    loaded,
    saving,
    byId,
    load,
    ensureLoaded,
    getById,
    create,
    update,
    remove,
  }
})
