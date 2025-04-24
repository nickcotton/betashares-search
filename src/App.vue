<template>
  <div class="h-screen grid gap-4 p-4">
    <div class="flex gap-3">
      <Input
        class="bg-white"
        v-model="query"
        @input="handleSearchInput"
        @keydown.enter="submitSearch"
        placeholder="Search for a name, symbol or keyword, e.g. ASX"
      ></Input>
      <Button @click="submitSearch">Search</Button>
    </div>
    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="results.length">
      {{ total }} results found
      <ul class="grid gap-3">
        <li
          class="bg-card text-card-foreground p-4 gap-6 rounded-xl border shadow-sm"
          v-for="result in results"
          :key="result.symbol"
        >
          <div class="flex gap-4">
            <div class="flex-1">
              <p>{{ result.symbol }}</p>
              <h2>{{ result.display_name }}</h2>
            </div>
            <div class="">
              <p>Size</p>
              <p>{{ formatSize(result.fund_size) }}</p>
            </div>
            <div class="">
              <p>1y</p>
              <p>{{ formatPerformance(result.one_year_return) }}</p>
            </div>
            <div class="">
              <p>5y</p>
              <p>{{ formatPerformance(result.five_year_return) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/composables/useSearch'
import debounce from './utils/debounce'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const query = ref(route.query.q?.toString() || '')

onMounted(() => {
  if (query.value) {
    search({ search_text: query.value })
  }
})

const { loading, results, total, search } = useSearch()

const debouncedSearch = debounce((value: string) => {
  console.log('Searched for:', value)
}, 300)

const handleSearchInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const searchValue = input.value

  debouncedSearch(searchValue)
}

const submitSearch = () => {
  router.replace({
    query: {
      ...route.query,
      q: query.value,
      page: '1',
    },
  })
  search({ search_text: query.value })
}

const formatSize = (value: string | null | undefined): string => {
  if (value == null) return 'N/A'

  const num = parseFloat(value)
  if (isNaN(num)) return 'N/A'

  const size = num * 1_000_000

  if (size >= 1e9) return (size / 1e9).toFixed(2) + 'B'
  if (size >= 1e6) return (size / 1e6).toFixed(2) + 'M'
  if (size >= 1e3) return (size / 1e3).toFixed(2) + 'K'

  return size.toFixed(2)
}

const formatPerformance = (value: string) => {
  if (value === null || value === undefined) return 'N/A'
  return parseFloat(value).toFixed(2) + '%'
}
</script>
