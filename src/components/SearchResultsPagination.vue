<template>
  <div class="flex items-baseline justify-center gap-4 pt-4">
    <Button
      variant="outline"
      class="select-none"
      @click="$emit('prevPage')"
      :disabled="currentPage === 1"
    >
      Previous
    </Button>

    <span>Page {{ currentPage }} of {{ totalPages }}</span>

    <Button
      variant="outline"
      class="select-none"
      @click="$emit('nextPage')"
      :disabled="currentPage === totalPages"
    >
      Next
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { currentPage = 1, totalPages = 0 } = defineProps<{
  currentPage: number
  totalPages: number
}>()
defineEmits(['prevPage', 'nextPage'])
</script>
