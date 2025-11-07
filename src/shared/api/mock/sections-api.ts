import type { Section } from '@/entities/section'
import { uniqueSlug } from '@/shared/lib/slug'

import { db } from './db'

export type CreateSectionPayload = Pick<Section, 'name' | 'tags'>
export type UpdateSectionPayload = Partial<CreateSectionPayload>

function cloneSections() {
  return structuredClone(db.sections)
}

export async function fetchSections() {
  return cloneSections()
}

export async function fetchSectionById(id: string) {
  return db.sections.find((section) => section.id === id)
}

export async function createSection(payload: CreateSectionPayload) {
  const section: Section = {
    id: uniqueSlug(
      payload.name,
      db.sections.map((item) => item.id),
    ),
    name: payload.name.trim(),
    tags: payload.tags.map((tag) => tag.trim()).filter(Boolean),
  }

  db.sections.push(section)
  return structuredClone(section)
}

export async function updateSection(id: string, payload: UpdateSectionPayload) {
  const index = db.sections.findIndex((section) => section.id === id)
  if (index === -1) {
    throw new Error('Section not found')
  }

  const current = db.sections[index]!
  const next: Section = {
    id: current.id,
    name: payload.name?.trim() ?? current.name,
    tags: payload.tags?.map((tag) => tag.trim()).filter(Boolean) ?? current.tags,
  }

  db.sections[index] = next
  return structuredClone(next)
}

export async function deleteSection(id: string) {
  const index = db.sections.findIndex((section) => section.id === id)
  if (index === -1) {
    throw new Error('Section not found')
  }

  db.sections.splice(index, 1)
  db.tasks = db.tasks.filter((task) => task.sectionId !== id)
}
