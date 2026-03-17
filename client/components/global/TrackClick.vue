<template>
  <span @click.capture="track">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  properties: {
    type: Object,
    default: () => ({}),
  },
})

const { logEvent } = useAmplitude()

function track(event) {
  console.log('TrackClick.track() called', {
    name: props.name,
    target: event.target,
    currentTarget: event.currentTarget,
    eventPhase: event.eventPhase
  })
  
  if (props.name) {
    logEvent(props.name, props.properties)
  }
  
  console.log('TrackClick.track() done, event should continue...')
  // KHÔNG preventDefault, KHÔNG stopPropagation
}
</script>
