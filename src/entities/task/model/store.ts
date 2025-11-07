import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Task } from '@/entities/task'
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '@/shared/api/mock'

export const useTasksStore = defineStore('tasks', () => {
  const items = ref<Task[]>([])
  const loaded = ref(false)
  const saving = ref(false)

  const byId = computed(() => {
    return Object.fromEntries(items.value.map((task) => [task.id, task]))
  })

  async function load() {
    items.value = await fetchTasks()
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

  function getBySectionId(sectionId: string) {
    return items.value.filter((task) => task.sectionId === sectionId)
  }

  async function create(payload: CreateTaskPayload) {
    saving.value = true
    try {
      const task = await createTask(payload)
      items.value = [...items.value, task]
      return task
    } finally {
      saving.value = false
    }
  }

  async function update(id: string, payload: UpdateTaskPayload) {
    saving.value = true
    try {
      const task = await updateTask(id, payload)
      items.value = items.value.map((item) => (item.id === id ? task : item))
      return task
    } finally {
      saving.value = false
    }
  }

  async function remove(id: string) {
    saving.value = true
    try {
      await deleteTask(id)
      items.value = items.value.filter((item) => item.id !== id)
    } finally {
      saving.value = false
    }
  }

  function removeBySectionId(sectionId: string) {
    items.value = items.value.filter((task) => task.sectionId !== sectionId)
  }

  return {
    items,
    loaded,
    saving,
    byId,
    load,
    ensureLoaded,
    getById,
    getBySectionId,
    create,
    update,
    remove,
    removeBySectionId,
  }
})
