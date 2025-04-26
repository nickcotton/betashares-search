// src/composables/useFilters.ts
import { ref } from 'vue'

export function useFilters() {
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])

  const extractFilters = (results: any[]) => {
    const categorySet = new Set<string>()
    const tagSet = new Set<string>()

    results.forEach((item) => {
      item.categories?.forEach((cat: string) => {
        if (cat) categorySet.add(cat)
      })
      item.tags?.forEach((tag: string) => {
        if (tag) tagSet.add(tag)
      })
    })

    categories.value = Array.from(categorySet).sort()
    tags.value = Array.from(tagSet).sort()
  }

  return {
    categories,
    tags,
    extractFilters,
  }
}
