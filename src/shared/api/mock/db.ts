import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'

import { initialSections } from './sections'
import { initialTasks } from './tasks'

export const db = {
  sections: structuredClone(initialSections) as Section[],
  tasks: structuredClone(initialTasks) as Task[],
}
