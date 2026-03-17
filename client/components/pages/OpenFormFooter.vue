<template>
  <div class="w-full hidden">
    <!-- Footer content hidden -->
  </div>
</template>

<script setup>
import opnformConfig from "~/opnform.config.js"

const { data: user } = useAuth().user()
const currYear = ref(new Date().getFullYear())
const version = computed(() => useFeatureFlag('version'))
</script>