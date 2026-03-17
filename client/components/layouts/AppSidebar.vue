<template>
  <BaseSidebar ref="sidebar">
    <!-- Header Slot -->
    <template #header>
      <!-- Workspace Dropdown -->
      <div class="grow">
        <WorkspaceDropdown>
          <template #default="{ workspace }">
            <button
              v-if="workspace"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-32 text-left"
            >
              <WorkspaceIcon :workspace="workspace" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ workspace.name }}
                </p>
              </div>
            </button>
          </template>
        </WorkspaceDropdown>
      </div>
      
      <!-- User Dropdown -->
      <div class="flex gap-2 items-center">
        <UserDropdown>
          <template #default="{ user }">
            <button
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                :src="user?.photo_url"
                class="rounded-full w-6 h-6 ring-2 ring-gray-200"
                :alt="user?.name"
              >
            </button>
          </template>
        </UserDropdown>
      </div>
    </template>

    <!-- Navigation Slot -->
    <template #navigation>
      <div 
        v-for="(section, index) in navigationSections" 
        :key="section.name || 'main'"
        :class="[
          index !== navigationSections.length - 1 ? 'mb-6' : '',
          index === 1 ? 'mt-auto' : ''
        ]"
      >
        <!-- Section Title -->
        <h3 
          v-if="section.name"
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3"
        >
          {{ section.name }}
        </h3>
        
        <!-- Section Items -->
        <NavigationList
          :items="section.items"
          tracking-name="sidebar_nav_click"
          :tracking-properties="(item) => ({ label: item.label })"
          @item-click="handleItemClick"
        />
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup>
import BaseSidebar from "~/components/layouts/BaseSidebar.vue"
import WorkspaceDropdown from "~/components/dashboard/WorkspaceDropdown.vue"
import WorkspaceIcon from "~/components/workspaces/WorkspaceIcon.vue"
import UserDropdown from "~/components/dashboard/UserDropdown.vue"
import NavigationList from "~/components/global/NavigationList.vue"
import { useSharedNavigation } from "~/composables/components/useSharedNavigation"

const route = useRoute()
const sidebar = ref(null)

const { sharedNavigationSections, createNavItem } = useSharedNavigation()

const { current: workspace } = useCurrentWorkspace()
const isSelfHosted = computed(() => useFeatureFlag('self_hosted'))
const { openSubscriptionModal } = useAppModals()

function isActiveRoute(prefix) {
  if (!prefix) return false
  return route.name?.startsWith(prefix)
}

const navigationSections = computed(() => [
  {
    name: null,
    items: [
      createNavItem({
        label: 'Create Form',
        icon: 'i-heroicons-plus',
        to: { name: 'forms-create' },
        active: isActiveRoute('forms-create'),
        // Màu xanh hệ thống
        class: 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium',
        kbd: ['N'],
      }),
      createNavItem({
        label: 'Home', 
        icon: 'i-heroicons-home',
        to: { name: 'home' },
        active: isActiveRoute('home'),
        class: 'hover:bg-gray-100'
      }),
      createNavItem({
        label: 'Templates',
        icon: 'i-heroicons-document-duplicate',
        to: { name: 'templates-my-templates' },
        active: isActiveRoute('templates'),
        class: 'hover:bg-gray-100'
      }),
      ...(workspace.value && !workspace.value.is_pro && !isSelfHosted.value ? [createNavItem({
        label: 'Upgrade to Pro',
        icon: 'i-heroicons-sparkles-solid', 
        onClick: () => {
          useAmplitude().logEvent('app_sidebar_upgrade_click')
          openSubscriptionModal({
            modal_title: 'Upgrade to Pro plan',
          })
        },
        class: 'text-[#0ea5e9] hover:bg-blue-50'
      })] : [])
    ]
  },
  ...sharedNavigationSections.value
])

function handleItemClick(_item) {
  if (sidebar.value && sidebar.value.isMobileMenuOpen) {
    sidebar.value.isMobileMenuOpen = false
  }
}
</script>
