// src/composables/useSearch.js
import { ref } from 'vue'

const API_URL = '/api/search'

export function useSearch() {
  const loading = ref(false)
  const results = ref([])
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
