<template>
  <div class="h-screen grid gap-4 p-4">
    <Input
      class="bg-white"
      @input="handleSearchInput"
      placeholder="Search for a name, symbol or keyword, e.g. ASX"
    ></Input>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import debounce from './utils/debounce'

const debouncedSearch = debounce((value: string) => {
  console.log('Searched for:', value)
}, 300)

const handleSearchInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const searchValue = input.value

  debouncedSearch(searchValue)
}
</script>
