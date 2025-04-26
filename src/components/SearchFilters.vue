<template>
  <div class="flex items-center gap-4">
    <div class="ml-auto grid gap-2">
      <Label class="text-sm">Sort by</Label>
      <Select v-model="sort">
        <SelectTrigger class="bg-card w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="symbol.asc">Symbol</SelectItem>
          <SelectItem value="display_name.asc">Name</SelectItem>
          <SelectItem value="fund_size.desc">Fund size</SelectItem>
          <SelectItem value="one_year_return.desc">1y return</SelectItem>
          <SelectItem value="five_year_return.desc">5y return</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const sort = defineModel('sort')
</script>
