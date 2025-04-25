<template>
  <div class="grid gap-4 p-4">
    <div class="flex gap-4">
      <BetasharesLogo class="h-8" />
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
      <ul class="grid gap-3">
        <li v-for="num in PAGE_SIZE" class="h-31 bg-white rounded-xl"></li>
      </ul>
    </div>
    <div v-else-if="results?.length === 0" class="text-center">
      <p>No results found</p>
      <p class="text-gray-400">Try searching for a name, symbol or keyword, e.g. ASX</p>
    </div>
    <div v-else-if="results?.length">
      <ul class="grid gap-3">
        <li
          class="bg-card text-card-foreground p-4 gap-6 rounded-xl border shadow-sm"
          v-for="result in results"
          :key="result.symbol"
        >
          <div class="flex gap-4">
            <div class="flex-1 flex flex-col gap-1">
              <p class="self-start bg-brand-orange text-white text-sm px-2 py-0.5 rounded-xs">
                {{ result.symbol }}
              </p>
              <h2 class="text-2xl">{{ result.display_name }}</h2>
              <p v-if="result.flagship_description_short" class="text-gray-400 text-sm">
                {{ result.flagship_description_short }}
              </p>
            </div>
            <div class="grid gap-1 bg-card text-card-foreground p-4 rounded-sm border shadow-sm">
              <p class="text-gray-400 text-sm font-medium">Size</p>
              <p class="text-2xl tabular-nums">{{ formatSize(result.fund_size) }}</p>
            </div>
            <div
              class="grid gap-1 bg-card text-card-foreground p-4 rounded-sm border shadow-sm min-w-32"
            >
              <p class="text-gray-400 text-sm font-medium">1y</p>
              <p
                class="text-2xl tabular-nums"
                :class="{
                  'text-green-600': result.one_year_return > 0,
                  'text-red-600': result.one_year_return < 0,
                }"
              >
                {{ formatPerformance(result.one_year_return) }}
              </p>
            </div>
            <div
              class="grid gap-1 bg-card text-card-foreground p-4 rounded-sm border shadow-sm min-w-32"
            >
              <p class="text-gray-400 text-sm font-medium">5y</p>
              <p
                class="text-2xl tabular-nums"
                :class="{
                  'text-green-600': result.five_year_return > 0,
                  'text-red-600': result.five_year_return < 0,
                }"
              >
                {{ formatPerformance(result.five_year_return) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <SearchResultsPagination
        v-if="total > PAGE_SIZE"
        :total-pages
        :current-page
        @prevPage="prevPage"
        @nextPage="nextPage"
      ></SearchResultsPagination>
    </div>
    <div v-else class="text-center">
      <p>Search</p>
      <p class="text-gray-400">Try searching for a name, symbol or keyword, e.g. ASX</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BetasharesLogo from '@/assets/logo.svg'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/composables/useSearch'
import debounce from './utils/debounce'
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchResultsPagination from '@/components/SearchResultsPagination.vue'

const route = useRoute()
const router = useRouter()
const query = ref(route.query.q?.toString() || '')
const currentPage = ref(Number(route.query.page) || 1)
const PAGE_SIZE = 15

const { loading, results, total, search } = useSearch()

watch(currentPage, (page) => {
  const params = {
    search_text: query.value,
    from: page,
    size: PAGE_SIZE,
  }

  router.replace({
    query: {
      ...route.query,
      page: String(page),
    },
  })

  search(params)
})

const debouncedSearch = debounce((value: string) => {
  console.log('Searched for:', value)
}, 300)

const handleSearchInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const searchValue = input.value

  debouncedSearch(searchValue)
}

const submitSearch = () => {
  const params = {
    search_text: query.value,
    from: 1,
    size: PAGE_SIZE,
  }

  router.replace({
    query: {
      ...route.query,
      q: query.value,
      page: '1',
    },
  })
  search(params)
}

const formatSize = (value: string | null | undefined): string => {
  if (value == null) return 'N/A'

  const num = parseFloat(value)
  if (isNaN(num)) return 'N/A'

  const size = num * 1_000_000

  if (size >= 1e9) return `$${(size / 1e9).toFixed(2)}B`
  if (size >= 1e6) return `$${(size / 1e6).toFixed(2)}M`
  if (size >= 1e3) return `$${(size / 1e3).toFixed(2)}K`

  return '$' + size.toFixed(2)
}

const formatPerformance = (value: string) => {
  if (value === null || value === undefined) return 'N/A'
  return parseFloat(value).toFixed(2) + '%'
}

const totalPages = computed(() => Math.ceil(total.value / PAGE_SIZE))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}
</script>
