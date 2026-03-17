<template>
  <div>
    <UButton
      size="sm"
      color="neutral"
      variant="ghost"
      icon="i-heroicons-arrow-down-tray"
      label="Export"
      @click="goToPreview"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  columns: {
    type: Object,
    required: true
  }
})

const goToPreview = () => {
  const url = `/api/form-builder/${props.form.id}/export?preview=1`
  window.open(url, '_blank')
}
</script>