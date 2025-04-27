<template>
  <div class="flex items-end gap-4">
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
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline">Management fee <ChevronDown class="size-4 opacity-50" /></Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-80">
        <div class="grid gap-4">
          <Slider v-model="managementFee" class="w-full" :max="3" :step="0.01" />
          <div class="flex items-center justify-between">
            <span class="text-sm">
              {{ managementFee[0].toFixed(2) }}% - {{ managementFee[1].toFixed(2) }}%
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'

const sort = defineModel('sort')
const selectedCategories = defineModel('selectedCategories')
const selectedTags = defineModel('selectedTags')
const managementFee = defineModel('managementFee')

const { categories = [], tags = [] } = defineProps<{
  categories: string[]
  tags: string[]
}>()
</script>
