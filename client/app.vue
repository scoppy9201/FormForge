<template>
  <AppProvider>
    <div
      id="app"
      class="bg-white dark:bg-notion-dark"
    >
      <NuxtLoadingIndicator color="#2563eb" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <ClientOnly>
        <div
          class="fixed z-[9999] left-0 bottom-0 p-4" id="admin-actions"
        >
          <UButtonGroup size="sm">
            <ToolsStopImpersonation />
          </UButtonGroup>
        </div>
      </ClientOnly>

      <ClientOnly>
        <Clarity />
        <FeatureBase />
        <SubscriptionModal />
        <QuickRegister />
      </ClientOnly>
    </div>
  </AppProvider>
</template>

<script setup>
import FeatureBase from "~/components/vendor/FeatureBase.vue"
import Clarity from "~/components/vendor/Clarity.vue"

const config = useRuntimeConfig()

// SEO and head configuration
useOpnSeoMeta({
  title: "Free Form Builder with Unlimited Submissions",
  description:
    "Build beautiful, powerful forms for free with CRMGO. Unlimited submissions, rich features, and seamless integrations — fully open-source and easy to use.",
  ogImage: "/img/social-preview.jpg",
  robots: () => {
    return config.public.env === "production" ? null : "noindex, nofollow"
  },
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - CRMGO` : "CRMGO"
  },
  meta: [
    {
      name: 'mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent'
    },
  ],
  link: [
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ],
  htmlAttrs: () => ({
    dir: 'ltr'
  })
})

const router = useRouter()

// Notify parent CRM on every route change (fix back button blank page)
router.afterEach((to) => {
  if (typeof window !== 'undefined' && window.parent !== window) {
    const path = to.fullPath
    let type = 'ROUTE_CHANGED'

    if (path.includes('/home') || path === '/') {
      type = 'NAVIGATE_HOME'
    } else if (path.includes('/forms/create')) {
      type = 'NAVIGATE_CREATE'
    } else if (path.includes('/templates')) {
      type = 'NAVIGATE_TEMPLATES'
    } else if (path.match(/\/forms\/[^\/]+\/show/)) {
      type = 'NAVIGATE_EDIT'
    }

    window.parent.postMessage({ type, data: { path } }, '*')
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.get('user_email')) {
      localStorage.setItem('crm_user_email', urlParams.get('user_email'))
      localStorage.setItem('crm_user_name', urlParams.get('user_name') || '')
    }

    const pathParam = urlParams.get('path')
    if (pathParam) {
      nextTick(() => {
        router.push(pathParam)
      })
    }

    // Hàm apply màu
    const applyBrandColor = (color) => {
      if (!color) return
      
      let styleEl = document.getElementById('crm-theme-override')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'crm-theme-override'
        document.head.appendChild(styleEl)
      }
      
      styleEl.textContent = `
        :root {
          --bg-form-color: ${color} !important;
          --form-color: ${color} !important;
          --color-blue-500: ${color} !important;
          --color-blue-600: ${color} !important;
          --color-form: ${color} !important;
        }

        .bg-blue-500 { background-color: ${color} !important; }
        .bg-blue-600 { background-color: ${color} !important; }
        .hover\\:bg-blue-600:hover { background-color: ${color} !important; }
        .border-blue-500 { border-color: ${color} !important; }
        .border-blue-600 { border-color: ${color} !important; }
        .ring-blue-500 { --tw-ring-color: ${color} !important; }
        .text-blue-600 { color: ${color} !important; }
        .text-blue-500 { color: ${color} !important; }
        [class*="bg-primary-5"] { background-color: ${color} !important; }
        [class*="text-primary"] { color: ${color} !important; }
        [class*="border-primary"] { border-color: ${color} !important; }
        .nuxt-loading-indicator { background-color: ${color} !important; }
      `
      console.log('[OpenForm] Brand color applied:', color)
    }

    // Đọc từ URL khi load
    const brandColor = urlParams.get('brand_color')
    if (brandColor) {
      applyBrandColor(decodeURIComponent(brandColor))
    }

    // Lắng nghe real-time từ CRM
    window.addEventListener('message', (event) => {
      if (!event.data || event.data.type !== 'CRM_THEME_CHANGE') return
      applyBrandColor(event.data.data?.brandColor)
    })
  }
})
</script>