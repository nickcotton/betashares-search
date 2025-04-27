// src/composables/useSearch.js
import { ref } from 'vue'

interface SearchResult {
  symbol: string
  display_name: string
  fund_size: string | null
  one_year_return: string | null
  five_year_return: string | null
  flagship_description_short?: string | null
  tags?: string[]
  categories?: string[]
}

const API_URL = '/api/search'

export function useSearch() {
  const loading = ref(false)
  const results = ref<SearchResult[]>([])
  const total = ref(0)

  const search = async (params = {}) => {
    loading.value = true
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      results.value = data.results || []
      total.value = data.count || 0
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    results,
    total,
    search,
  }
}
