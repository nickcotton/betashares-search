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
        <li v-for="result in results" :key="result.symbol" class="bg-white p-4 border rounded-lg">
          <div class="flex gap-3">
            <div class="flex-1">
              <p>{{ result.symbol }}</p>
              <h2>{{ result.display_name }}</h2>
            </div>
            <div class="">
              <p>Size</p>
              <p>{{ result.fund_size }}</p>
            </div>
            <div class="">
              <p>1y</p>
              <p>{{ result.one_year_return }}</p>
            </div>
            <div class="">
              <p>5y</p>
              <p>{{ result.five_year_return }}</p>
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
import { ref } from 'vue'

const query = ref('')
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
  search({ search_text: query.value })
}
</script>
