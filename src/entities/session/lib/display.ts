import type { Session, SessionGrade } from '../model/types'

const GRADE_LABELS: Record<SessionGrade, string> = {
  perfect: 'Perfect',
  good: 'Good',
  meh: 'Meh',
  'dont-know': "Don't know",
}

const GRADE_ORDER: SessionGrade[] = ['perfect', 'good', 'meh', 'dont-know']

export function getGradeLabel(grade: SessionGrade) {
  return GRADE_LABELS[grade]
}

export function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function sessionScore(session: Session) {
  const perfect = session.answers.filter((answer) => answer.grade === 'perfect').length
  return `${perfect}/${session.taskIds.length} perfect`
}

export function sessionGradeCounts(session: Session) {
  const counts: Record<SessionGrade, number> = {
    perfect: 0,
    good: 0,
    meh: 0,
    'dont-know': 0,
  }

  for (const answer of session.answers) {
    counts[answer.grade] += 1
  }

  return GRADE_ORDER.filter((grade) => counts[grade] > 0).map((grade) => ({
    grade,
    count: counts[grade],
  }))
}
