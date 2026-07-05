import type { Session, SessionAnswer, SessionGrade } from '@/entities/session'
import { uniqueSlug } from '@/shared/lib/slug'

import { db } from './db'

export type CreateSessionPayload = {
  taskIds: string[]
}

export type AddSessionAnswerPayload = {
  taskId: string
  grade: SessionGrade
}

function cloneSessions() {
  return structuredClone(db.sessions)
}

function findSession(id: string) {
  const session = db.sessions.find((item) => item.id === id)
  if (!session) {
    throw new Error('Session not found')
  }

  return session
}

export async function fetchSessions() {
  return cloneSessions().sort(
    (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
  )
}

export async function fetchSessionById(id: string) {
  const session = db.sessions.find((item) => item.id === id)
  return session ? structuredClone(session) : undefined
}

export async function createSession(payload: CreateSessionPayload) {
  if (payload.taskIds.length === 0) {
    throw new Error('Session requires at least one task')
  }

  const session: Session = {
    id: uniqueSlug(
      'session',
      db.sessions.map((item) => item.id),
    ),
    startedAt: new Date().toISOString(),
    completedAt: null,
    taskIds: [...payload.taskIds],
    answers: [],
  }

  db.sessions.push(session)
  return structuredClone(session)
}

export async function addSessionAnswer(id: string, payload: AddSessionAnswerPayload) {
  const session = findSession(id)

  if (!session.taskIds.includes(payload.taskId)) {
    throw new Error('Task is not part of this session')
  }

  if (session.answers.some((answer) => answer.taskId === payload.taskId)) {
    throw new Error('Task already answered in this session')
  }

  const answer: SessionAnswer = {
    taskId: payload.taskId,
    grade: payload.grade,
    answeredAt: new Date().toISOString(),
  }

  session.answers.push(answer)
  return structuredClone(session)
}

export async function completeSession(id: string) {
  const session = findSession(id)

  if (session.answers.length !== session.taskIds.length) {
    throw new Error('Session is not finished yet')
  }

  session.completedAt = new Date().toISOString()
  return structuredClone(session)
}
