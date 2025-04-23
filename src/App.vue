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

const handleSearchInput = (event: Event) => {
  // debounce the input event and call the search function
  const input = event.target as HTMLInputElement
  const searchValue = input.value

  // Call your search function here
  console.log('Searching for:', searchValue)
  // You can also use a debounce function to limit the number of calls
  // to the search function while the user is typing
  // For example, you can use lodash's debounce function
  // const debouncedSearch = debounce((value) => {
  //   console.log('Searching for:', value)
  // }, 300)
  // debouncedSearch(searchValue)
  // Or you can implement your own debounce function
  // const debounce = (func: Function, delay: number) => {
  //   let timeout: NodeJS.Timeout
  //   return (...args: any[]) => {
  //     clearTimeout(timeout)
  //     timeout = setTimeout(() => {
  //       func.apply(this, args)
  //     }, delay)
  //   }
  // }
  // const debouncedSearch = debounce((value: string) => {
  //   console.log('Searching for:', value)
  // }, 300)
  // debouncedSearch(searchValue)
}
</script>
