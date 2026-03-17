import opnformConfig from "~/opnform.config.js"

export const useSharedNavigation = () => {
  const appStore = useAppStore()
  const crisp = useCrisp()
  
  const isSelfHosted = computed(() => useFeatureFlag('self_hosted'))
  const featurebaseLoaded = computed(() => {
    return import.meta.client && window.Featurebase
  })

  // Check for new changes in changelog
  const hasNewChanges = computed(() => {
    if (import.meta.server || !window.Featurebase || !appStore.featureBaseEnabled) return false
    return window.Featurebase("unviewed_changelog_count") > 0
  })

  // Open changelog modal
  function openChangelog() {
    if (import.meta.server || !window.Featurebase) return
    window.Featurebase("manually_open_changelog_popup")
  }

  // Default button configuration
  const defaultButtonProps = {
    variant: 'ghost',
    activeVariant: 'soft', 
    color: 'neutral',
    block: true,
  }

  // Helper function to apply defaults to navigation items
  const createNavItem = (item) => {
    const baseItem = {
      ...defaultButtonProps,
      ...item
    }
    
    // Add custom classes to darken ghost/soft variants for better visibility on neutral-100 background
    const customClasses = ['group']
    
    // For ghost variant (default), darken hover state
    if (baseItem.variant === 'ghost' && baseItem.color === 'neutral') {
      customClasses.push('hover:bg-neutral-200/80')
      baseItem.ui = {
        ...baseItem.ui,
        leadingIcon: 'text-neutral-400 group-hover:text-neutral-500'
      }
    }
    
    // For soft variant (active state), darken background
    if (baseItem.active && baseItem.activeVariant === 'soft' && baseItem.color === 'neutral') {
      customClasses.push('bg-neutral-200/90 text-neutral-800')
    }
    
    // For primary color buttons, ensure good contrast
    if (baseItem.color === 'primary') {
      if (baseItem.variant === 'ghost') {
        customClasses.push('hover:bg-primary-100/80')
      }
      if (baseItem.active && baseItem.activeVariant === 'soft') {
        customClasses.push('data-[active=true]:bg-primary-100/90')
      }
    }
    
    return {
      ...baseItem,
      class: customClasses.length > 0 ? customClasses.join(' ') : undefined
    }
  }
  
  const sharedNavigationSections = computed(() => [])

  return {
    sharedNavigationSections,
    createNavItem,
    defaultButtonProps
  }
}
