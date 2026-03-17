<template>
  <div>
    <div class="flex flex-wrap items-end mt-5 gap-2">
      <h3 class="flex-grow font-medium text-lg">
        Views & Submission History
      </h3>
      <VForm size="sm">
      <DateInput
        :form="filterForm"
        name="filter_date"
        class="flex-1 !mb-0"
        :date-range="true"
        :disable-future-dates="true"
      />
      </VForm>
      <UButton 
        class="self-stretch mt-1"
        color="neutral"
        variant="outline"
        @click.prevent="refresh" 
        icon="i-heroicons-arrow-path" 
        :loading="isLoading"
      />
    </div>
    <div
      class="border border-neutral-300 rounded-lg shadow-xs p-4 mb-5 w-full mx-auto mt-2 select-all"
    >
      <VTransition name="fade">
        <div
          v-if="isLoading"
          class="space-y-3"
        >
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <USkeleton class="h-32 w-full" />
        </div>
        <LineChart
          v-else
          :options="chartOptions"
          :data="chartData"
        />
      </VTransition>
    </div>
  </div>
</template>

<script setup>
import { Line as LineChart } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
)

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
})

const toDate = new Date()
const fromDate = new Date(toDate)
fromDate.setDate(toDate.getDate() - 29)
const filterForm = useForm({
  filter_date: [fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]],
})

// Use query composables instead of manual API calls
const { stats, invalidateStats } = useFormStats()

// Set up default date range (last 30 days)
onMounted(() => {
  const toDate = new Date()
  const fromDate = new Date(toDate)
  fromDate.setDate(toDate.getDate() - 29)
  filterForm.filter_date = [fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]]
})

const fromDateComputed = computed(() => {
  return filterForm.filter_date?.[0] ? filterForm.filter_date[0].split('T')[0] : null
})
const toDateComputed = computed(() => {
  return filterForm.filter_date?.[1] ? filterForm.filter_date[1].split('T')[0] : null
})

// Get stats data using query composable - BỎ CHECK PRO
const { data: statsData, isFetching: isQueryLoading } = stats(
  props.form.workspace_id,
  props.form.id,
  fromDateComputed,
  toDateComputed,
  {
    enabled: computed(() => {
      return import.meta.client && !!props.form
    })
  }
)

// Handle loading state for SSR - BỎ CHECK PRO
const isLoading = computed(() => {
  if (import.meta.server) {
    return !!props.form
  }
  return isQueryLoading.value
})

// Refresh function to invalidate both stats and stats-details queries with current parameters
const refresh = () => {
  invalidateStats(props.form.id)
}

// Chart configuration
const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: true,
}

// Chart data computed from query results
const chartData = computed(() => {
  const viewsData = statsData.value?.views || {}
  const submissionsData = statsData.value?.submissions || {}
  
  // Convert object {date: count} to array of counts
  const viewsCounts = Object.values(viewsData)
  const submissionsCounts = Object.values(submissionsData)
  
  const baseDatasets = [
    {
      label: "Form Views",
      backgroundColor: "rgba(59, 130, 246, 1)",
      borderColor: "rgba(59, 130, 246, 1)",
      data: viewsCounts,  
    },
    {
      label: "Form Submissions",
      backgroundColor: "rgba(16, 185, 129, 1)",
      borderColor: "rgba(16, 185, 129, 1)",
      data: submissionsCounts,  
    },
  ]

  // Add partial submissions dataset if enabled
  if (props.form.enable_partial_submissions) {
    const partialSubmissionsData = statsData.value?.partial_submissions || {}
    const partialSubmissionsCounts = Object.values(partialSubmissionsData)
    
    baseDatasets.push({
      label: "Partial Submissions",
      backgroundColor: "rgba(255, 193, 7, 1)",
      borderColor: "rgba(255, 193, 7, 1)",
      data: partialSubmissionsCounts,
    })
  }

  return {
    labels: Object.keys(viewsData),  
    datasets: baseDatasets,
  }
})
</script>