import type { Task } from '@/entities/task'
import { uniqueSlug } from '@/shared/lib/slug'

import { db } from './db'

export type CreateTaskPayload = Pick<Task, 'sectionId' | 'question' | 'answer'>
export type UpdateTaskPayload = Partial<CreateTaskPayload>

function cloneTasks() {
  return structuredClone(db.tasks)
}

export async function fetchTasks() {
  return cloneTasks()
}

export async function fetchTasksBySectionId(sectionId: string) {
  return cloneTasks().filter((task) => task.sectionId === sectionId)
}

export async function fetchTaskById(id: string) {
  return db.tasks.find((task) => task.id === id)
}

export async function createTask(payload: CreateTaskPayload) {
  const sectionExists = db.sections.some((section) => section.id === payload.sectionId)
  if (!sectionExists) {
    throw new Error('Section not found')
  }

  const task: Task = {
    id: uniqueSlug(
      payload.question,
      db.tasks.map((item) => item.id),
    ),
    sectionId: payload.sectionId,
    question: payload.question.trim(),
    answer: payload.answer.trim(),
  }

  db.tasks.push(task)
  return structuredClone(task)
}

export async function updateTask(id: string, payload: UpdateTaskPayload) {
  const index = db.tasks.findIndex((task) => task.id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }

  if (payload.sectionId) {
    const sectionExists = db.sections.some((section) => section.id === payload.sectionId)
    if (!sectionExists) {
      throw new Error('Section not found')
    }
  }

  const current = db.tasks[index]!
  const next: Task = {
    id: current.id,
    sectionId: payload.sectionId ?? current.sectionId,
    question: payload.question?.trim() ?? current.question,
    answer: payload.answer?.trim() ?? current.answer,
  }

  db.tasks[index] = next
  return structuredClone(next)
}

export async function deleteTask(id: string) {
  const index = db.tasks.findIndex((task) => task.id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }

  db.tasks.splice(index, 1)
}
