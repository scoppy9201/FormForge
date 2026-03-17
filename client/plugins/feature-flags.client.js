import { contentApi } from '~/api/content'
export default defineNuxtPlugin(async (nuxtApp) => {
  const featureFlagsState = useState('featureFlags', () => ({}))
  
  // Load flags on client startup vì ssr: false
  try {
    const flags = await contentApi.featureFlags.list()
    featureFlagsState.value = flags
  } catch (error) {
    console.error('Failed to load feature flags:', error)
  }

  nuxtApp.provide('refreshFeatureFlags', async () => {
    try {
      const flags = await contentApi.featureFlags.list({
        query: { t: Date.now() }
      })
      featureFlagsState.value = flags
      return flags
    } catch (error) {
      console.error('Failed to refresh feature flags:', error)
      throw error
    }
  })
})