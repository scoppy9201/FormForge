<template>
  <div class="p-4">
    <div class="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
      <div
        v-for="(stat, index) in [
          { label: 'Views', value: totalViews, placeholder: '123' },
          { label: 'Submissions', value: totalSubmissions, placeholder: '123' },
          { label: 'Completion', value: completionRate + '%', placeholder: '100%' },
          { label: 'Avg. Duration', value: averageDuration, placeholder: '10 seconds' }
        ]"
        :key="index"
        class="border border-neutral-300 rounded-lg shadow-xs p-4"
      >
        <div class="mb-2 text-xs text-neutral-500">
          {{ stat.label }}
        </div>
         
        <VTransition name="fade">
        <USkeleton
          v-if="isLoading"
          class="h-7 w-16"
        />
        <!-- TODO: BẬT LẠI KHI CẦN PRO FEATURE: thêm v-else-if="form.is_pro" -->
        <span
          v-else
          class="font-medium text-xl"
        >
          {{ stat.value }}
        </span>
        <!-- TODO: BẬT LẠI KHI CẦN PRO FEATURE
        <span
          v-else
          class="blur-[3px] pointer-events-none"
        >
          {{ stat.placeholder }}
        </span>
        -->
      </VTransition>
      </div>
    </div>

    <FormStats 
      class="w-full max-w-4xl mx-auto" 
      :form="form" 
    />
    
    <FormTrafficBreakdown
      class="w-full max-w-4xl mx-auto mt-8" 
      :form="form" 
      :meta-data="statsData?.meta_stats ?? {}" 
      :is-loading="isLoading"
    />
  </div>
</template>

<script setup>
import FormStats from "~/components/open/forms/components/FormStats.vue"
import FormTrafficBreakdown from "~/components/open/forms/components/FormTrafficBreakdown.vue"

const props = defineProps({
  form: { type: Object, required: true },
})

definePageMeta({
  middleware: "auth",
})
useOpnSeoMeta({
  title: props.form ? "Form Analytics - " + props.form.title : "Form Analytics",
})

// Use query composables instead of manual API calls
const { statsDetails } = useFormStats()

// Get stats data using query composable
// TODO: BẬT LẠI KHI CẦN PRO FEATURE - Thêm && props.form.is_pro
const { data: statsData, isFetching: isQueryLoading } = statsDetails(
  props.form.workspace_id, 
  props.form.id,
  {
    enabled: computed(() => import.meta.client && !!props.form) // TEMPORARY: Bỏ check is_pro
    // enabled: computed(() => import.meta.client && !!props.form && props.form.is_pro) // TODO: BẬT LẠI DÒNG NÀY
  }
)

// TODO: BẬT LẠI KHI CẦN PRO FEATURE - Thêm && props.form.is_pro
const isLoading = computed(() => {
  if (import.meta.server) {
    return !!props.form // TEMPORARY: Bỏ check is_pro
    // return !!props.form && props.form.is_pro // TODO: BẬT LẠI DÒNG NÀY
  }
  return isQueryLoading.value
})

// ✅ FIX: Computed values - xử lý cả trường hợp object và number
const totalViews = computed(() => {
  const views = statsData.value?.views
  
  // Nếu là object (ví dụ: {"2026-01-30": 4}), tính tổng
  if (views && typeof views === 'object' && !Array.isArray(views)) {
    return Object.values(views).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
  }
  
  // Nếu là số, return trực tiếp
  if (typeof views === 'number') {
    return views
  }
  
  return 0
})

const totalSubmissions = computed(() => {
  const submissions = statsData.value?.submissions
  
  // Nếu là object, tính tổng
  if (submissions && typeof submissions === 'object' && !Array.isArray(submissions)) {
    return Object.values(submissions).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
  }
  
  // Nếu là số, return trực tiếp
  if (typeof submissions === 'number') {
    return submissions
  }
  
  return 0
})

const completionRate = computed(() => Math.min(100, statsData.value?.completion_rate ?? 0))
const averageDuration = computed(() => statsData.value?.average_duration ?? '-')
</script>