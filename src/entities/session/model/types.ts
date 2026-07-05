export type SessionGrade = 'perfect' | 'good' | 'meh' | 'dont-know'

export interface SessionAnswer {
  taskId: string
  grade: SessionGrade
  answeredAt: string
}

export interface Session {
  id: string
  startedAt: string
  completedAt: string | null
  taskIds: string[]
  answers: SessionAnswer[]
}
