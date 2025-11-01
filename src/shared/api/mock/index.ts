import { mockSections } from './sections'
import { mockTasks } from './tasks'

export { mockSections, mockTasks }

export function getTasksBySectionId(sectionId: string) {
  return mockTasks.filter((task) => task.sectionId === sectionId)
}

export function getTaskById(taskId: string) {
  return mockTasks.find((task) => task.id === taskId)
}

export function getSectionById(sectionId: string) {
  return mockSections.find((section) => section.id === sectionId)
}
