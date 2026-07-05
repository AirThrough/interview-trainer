import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Session } from '@/entities/session'
import {
  addSessionAnswer,
  completeSession,
  createSession,
  fetchSessions,
  type AddSessionAnswerPayload,
  type CreateSessionPayload,
} from '@/shared/api/mock'

export const useSessionsStore = defineStore('sessions', () => {
  const items = ref<Session[]>([])
  const loaded = ref(false)
  const saving = ref(false)

  const byId = computed(() => {
    return Object.fromEntries(items.value.map((session) => [session.id, session]))
  })

  async function load() {
    items.value = await fetchSessions()
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

  async function create(payload: CreateSessionPayload) {
    saving.value = true
    try {
      const session = await createSession(payload)
      items.value = [session, ...items.value]
      return session
    } finally {
      saving.value = false
    }
  }

  async function addAnswer(id: string, payload: AddSessionAnswerPayload) {
    saving.value = true
    try {
      const session = await addSessionAnswer(id, payload)
      items.value = items.value.map((item) => (item.id === id ? session : item))
      return session
    } finally {
      saving.value = false
    }
  }

  async function complete(id: string) {
    saving.value = true
    try {
      const session = await completeSession(id)
      items.value = items.value.map((item) => (item.id === id ? session : item))
      return session
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
    addAnswer,
    complete,
  }
})
