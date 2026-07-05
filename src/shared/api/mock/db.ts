import type { Section } from '@/entities/section'
import type { Session } from '@/entities/session'
import type { Task } from '@/entities/task'

import { initialSections } from './sections'
import { initialSessions } from './sessions'
import { initialTasks } from './tasks'

export const db = {
  sections: structuredClone(initialSections) as Section[],
  tasks: structuredClone(initialTasks) as Task[],
  sessions: structuredClone(initialSessions) as Session[],
}
