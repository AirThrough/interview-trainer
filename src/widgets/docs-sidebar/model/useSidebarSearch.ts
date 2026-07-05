import { computed, ref, type Ref } from 'vue'

import type { Section } from '@/entities/section'
import type { Task } from '@/entities/task'

export function useSidebarSearch(sections: Ref<Section[]>, tasks: Ref<Task[]>) {
  const query = ref('')

  const normalizedQuery = computed(() => query.value.trim().toLowerCase())

  const isSearching = computed(() => normalizedQuery.value.length > 0)

  function sectionMatches(section: Section) {
    const q = normalizedQuery.value
    if (!q) return true

    if (section.name.toLowerCase().includes(q)) return true

    return section.tags.some((tag) => tag.toLowerCase().includes(q))
  }

  function taskMatches(task: Task) {
    const q = normalizedQuery.value
    if (!q) return true

    return (
      task.question.toLowerCase().includes(q) || task.answer.toLowerCase().includes(q)
    )
  }

  const filteredSections = computed(() => {
    if (!isSearching.value) return sections.value

    return sections.value.filter((section) => {
      if (sectionMatches(section)) return true

      return tasks.value.some(
        (task) => task.sectionId === section.id && taskMatches(task),
      )
    })
  })

  function filteredTasksForSection(section: Section) {
    const sectionTasks = tasks.value.filter((task) => task.sectionId === section.id)

    if (!isSearching.value) return sectionTasks

    if (sectionMatches(section)) return sectionTasks

    return sectionTasks.filter(taskMatches)
  }

  return {
    query,
    isSearching,
    filteredSections,
    filteredTasksForSection,
  }
}
