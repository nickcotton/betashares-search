<template>
  <div class="flex items-center gap-4">
    <div class="grid gap-2">
      <Label class="text-sm">Categories</Label>
      <Select multiple v-model="selectedCategories">
        <SelectTrigger class="bg-card w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="grid gap-2">
      <Label class="text-sm">Tags</Label>
      <Select multiple v-model="selectedTags">
        <SelectTrigger class="bg-card w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem v-for="tag in tags" :key="tag" :value="tag">
            {{ tag }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
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
const selectedCategories = defineModel('selectedCategories')
const selectedTags = defineModel('selectedTags')

const { categories = [], tags = [] } = defineProps<{
  categories: string[]
  tags: string[]
}>()
</script>
