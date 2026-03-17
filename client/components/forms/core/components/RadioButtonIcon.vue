<template>
  <div :style="colorStyle" class="inline-flex items-center">
    <!-- Checked state -->
    <svg
      v-show="isChecked"
      :class="[
        'block',
        'text-[var(--form-color,#3B82F6)]',
        resolvedSize === 'xs' ? 'w-3 h-3' : '',
        resolvedSize === 'sm' ? 'w-4 h-4' : '',
        resolvedSize === 'md' ? 'w-5 h-5' : '',
        resolvedSize === 'lg' ? 'w-6 h-6 mx-1' : '',
        props.ui?.slots?.checkedIcon
      ]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      <circle cx="12" cy="12" r="5"/>
    </svg>

    <!-- Unchecked state -->
    <svg
      v-show="!isChecked"
      :class="[
        'block',
        resolvedTheme === 'default' ? 'text-neutral-300 dark:text-neutral-600' : '',
        resolvedTheme === 'simple' ? 'text-neutral-300 dark:text-neutral-600' : '',
        resolvedTheme === 'notion' ? 'text-notion-input-border dark:text-notion-input-borderDark' : '',
        resolvedTheme === 'minimal' ? 'text-neutral-400 dark:text-neutral-600' : '',
        resolvedTheme === 'transparent' ? 'text-neutral-300 dark:text-neutral-600' : '',
        resolvedSize === 'xs' ? 'w-3 h-3' : '',
        resolvedSize === 'sm' ? 'w-4 h-4' : '',
        resolvedSize === 'md' ? 'w-5 h-5' : '',
        resolvedSize === 'lg' ? 'w-6 h-6 mx-1' : '',
        props.ui?.slots?.uncheckedIcon
      ]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  isChecked: {
    type: Boolean,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  size: {type: String, default: null}, 
  theme: {type: String, default: null},
  ui: {type: Object, default: () => ({})}
})

const injectedSize = inject('formSize', null)
const injectedTheme = inject('formTheme', null)

const resolvedSize = computed(() => {
  return props.size || injectedSize?.value || 'md'
})

const resolvedTheme = computed(() => {
  return props.theme || injectedTheme?.value || 'default'
})

const colorStyle = computed(() => ({
  '--form-color': props.color
}))
</script>