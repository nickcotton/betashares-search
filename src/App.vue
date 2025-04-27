<template>
  <div class="grid gap-4 p-4">
    <div class="flex gap-4">
      <BetasharesLogo class="h-8" />
      <div class="flex-1 relative z-10">
        <Input
          class="bg-white"
          v-model="query"
          @keydown.enter="submitSearch"
          @focus="searchInputFocused = true"
          @blur="handleBlur"
          placeholder="Search for a name, symbol or keyword, e.g. ASX"
        ></Input>
        <ul
          v-if="filteredSuggestions.length && searchInputFocused"
          class="absolute top-full bg-white rounded-md shadow-md mt-2 max-h-64 w-96 overflow-auto"
        >
          <li
            v-for="suggestion in filteredSuggestions"
            :key="suggestion"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="selectSuggestion(suggestion)"
            v-html="highlightMatch(suggestion)"
          ></li>
        </ul>
      </div>
      <Button @click="submitSearch">Search</Button>
    </div>
    <SearchFilters
      v-model:sort="sort"
      v-model:selected-categories="selectedCategories"
      v-model:selected-tags="selectedTags"
      v-model:management-fee="managementFee"
      :categories
      :tags
      :inert="filtersDisabled"
      :class="{ 'opacity-50': filtersDisabled }"
    ></SearchFilters>
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
          <div class="flex items-start gap-4">
            <div class="flex-1 flex flex-col">
              <p class="self-start bg-brand-orange text-white text-sm px-2 py-0.5 rounded-xs mb-2">
                {{ result.symbol }}
              </p>
              <h2 class="text-2xl">{{ result.display_name }}</h2>
              <p v-if="result.flagship_description_short" class="text-gray-400 text-sm mt-2">
                {{ result.flagship_description_short }}
              </p>
              <p v-if="result.tags.length" class="flex gap-2 items-center mt-4">
                <span class="text-gray-400 text-sm">Tags:</span>
                <span
                  v-for="tag in result.tags"
                  :key="tag"
                  class="inline-flex items-center rounded border bg-orange-50 border-orange-200 px-2.5 py-0.5 text-xs font-semibold transition-colors text-orange-500"
                >
                  {{ tag }}
                </span>
              </p>
            </div>
            <div class="grid gap-1 text-right min-w-32">
              <p class="text-gray-300 text-sm font-medium">Size</p>
              <p class="text-2xl tabular-nums">{{ formatSize(result.fund_size) }}</p>
            </div>
            <div class="grid gap-1 text-right min-w-32">
              <p class="text-gray-300 text-sm font-medium">1y</p>
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
            <div class="grid gap-1 text-right min-w-32">
              <p class="text-gray-300 text-sm font-medium">5y</p>
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
import { useFilters } from '@/composables/useFilters'
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchFilters from '@/components/SearchFilters.vue'
import SearchResultsPagination from '@/components/SearchResultsPagination.vue'
import popularSearchTerms from '@/lib/popular-searches.json'

const route = useRoute()
const router = useRouter()
const query = ref(route.query.q?.toString() || '')
const currentPage = ref(Number(route.query.page) || 1)
const sort = ref(route.query.sort?.toString() || 'symbol.asc')
const selectedCategories = ref<string[]>(
  route.query.categories ? (route.query.categories as string).split(',') : [],
)
const selectedTags = ref<string[]>(route.query.tags ? (route.query.tags as string).split(',') : [])
const managementFee = ref([0.01, 2.54])
const PAGE_SIZE = 15
const searchInputFocused = ref(false)

const { loading, results, total, search } = useSearch()

watch([currentPage, sort, selectedCategories, selectedTags, managementFee], ([page, s]) => {
  const params = {
    search_text: query.value,
    from: page,
    size: PAGE_SIZE,
    order_by: s,
    management_fee_min: managementFee.value[0],
    management_fee_max: managementFee.value[1],
  }

  if (selectedCategories.value.length && !selectedCategories.value.includes('all')) {
    params.categories = selectedCategories.value
  }

  if (selectedTags.value.length && !selectedTags.value.includes('all')) {
    params.tags = selectedTags.value
  }

  router.replace({
    query: {
      ...route.query,
      page: String(page) === '1' ? undefined : String(page),
      sort: s === 'symbol.asc' ? undefined : s,
      categories: selectedCategories.value.length ? selectedCategories.value.join(',') : undefined,
      tags: selectedTags.value.length ? selectedTags.value.join(',') : undefined,
      management_fee_min:
        managementFee.value[0] !== 0.01 ? managementFee.value[0].toFixed(2) : undefined,
      management_fee_max:
        managementFee.value[1] !== 2.54 ? managementFee.value[1].toFixed(2) : undefined,
    },
  })

  search(params)
})

const { categories, tags, extractFilters } = useFilters()

// After search results come back:
watch(results, (newResults) => {
  if (newResults.length) {
    extractFilters(newResults)
  }
})

const filteredSuggestions = computed(() => {
  const term = query.value.toLowerCase().trim()

  if (term.length < 2) {
    return []
  }

  return popularSearchTerms
    .filter((suggestion) => suggestion.toLowerCase().startsWith(term))
    .slice(0, 8)
})

const selectSuggestion = (suggestion: string) => {
  query.value = suggestion
  submitSearch()
}

const highlightMatch = (suggestion: string) => {
  const term = query.value.toLowerCase().trim()
  if (!term) return suggestion

  const lowerSuggestion = suggestion.toLowerCase()
  const index = lowerSuggestion.indexOf(term)

  if (index === -1) return suggestion

  const before = suggestion.slice(0, index)
  const match = suggestion.slice(index, index + term.length)
  const after = suggestion.slice(index + term.length)

  return `${before}<strong class="text-brand-orange">${match}</strong>${after}`
}

const submitSearch = () => {
  const params = {
    search_text: query.value,
    from: 1,
    size: PAGE_SIZE,
    order_by: sort.value,
    management_fee_min: managementFee.value[0],
    management_fee_max: managementFee.value[1],
  }

  if (selectedCategories.value.length && !selectedCategories.value.includes('all')) {
    params.categories = selectedCategories.value
  }

  if (selectedTags.value.length && !selectedTags.value.includes('all')) {
    params.tags = selectedTags.value
  }

  router.replace({
    query: {
      q: query.value || undefined,
      page: undefined,
      sort: sort.value !== 'symbol.asc' ? sort.value : undefined,
      categories: selectedCategories.value.length ? selectedCategories.value.join(',') : undefined,
      tags: selectedTags.value.length ? selectedTags.value.join(',') : undefined,
      management_fee_min:
        managementFee.value[0] !== 0.01 ? managementFee.value[0].toFixed(2) : undefined,
      management_fee_max:
        managementFee.value[1] !== 2.54 ? managementFee.value[1].toFixed(2) : undefined,
    },
  })
  search(params)
}

const formatSize = (value: string | null | undefined): string => {
  if (value == null) return 'N/A'

  const num = parseFloat(value)
  if (isNaN(num)) return 'N/A'

  const size = num * 1_000_000

  if (size >= 1e12) return `$${(size / 1e12).toFixed(2)}T`
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

const filtersDisabled = computed(() => {
  return loading.value || !results.value?.length
})

const handleBlur = () => {
  // Tiny delay to allow click events to fire
  setTimeout(() => {
    searchInputFocused.value = false
  }, 100)
}
</script>
