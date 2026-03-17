<template>
  <SettingsModal
    v-model="isOpen"
    v-model:active-tab="localActiveTab"
    @close="closeModal"
    v-if="workspace"
  >
    <!-- Settings Pages - Auto-register themselves -->
    <SettingsModalPage
      id="information"
      label="Information"
      icon="i-heroicons-information-circle"
    >
      <LazyWorkspacesSettingsInformation />
    </SettingsModalPage>

    <SettingsModalPage
      id="members"
      label="Members"
      icon="i-heroicons-user-group"
    >
      <LazyWorkspacesSettingsMembers />
    </SettingsModalPage>

    <SettingsModalPage
      id="domains"
      label="Domains"
      icon="i-heroicons-globe-alt"
    >
      <LazyWorkspacesSettingsDomains />
    </SettingsModalPage>
    
    <SettingsModalPage
      id="emails"
      label="Emails"
      icon="i-heroicons-envelope"
    >
      <LazyWorkspacesSettingsEmails />
    </SettingsModalPage>

    <SettingsModalPage
      id="sso"
      label="SSO"
      icon="i-heroicons-shield-check"
    >
      <LazyWorkspacesSettingsSso />
    </SettingsModalPage>

    <SettingsModalPage
      id="custom-code"
      label="Custom Code"
      icon="i-heroicons-code-bracket"
    >
      <LazyWorkspacesSettingsCustomCode />
    </SettingsModalPage>
  </SettingsModal>
</template>

<script setup>
import { computed } from 'vue'
import SettingsModal from '~/components/pages/settings/SettingsModal.vue'
import SettingsModalPage from '~/components/pages/settings/SettingsModalPage.vue'
import LazyWorkspacesSettingsSso from './sso/index.vue'
import LazyWorkspacesSettingsCustomCode from './CustomCode.vue'

const emit = defineEmits(['update:activeTab'])

const props = defineProps({
  activeTab: {
    type: String,
    default: null
  }
})

const { current: workspace } = useCurrentWorkspace()

const isOpen = computed({
  get: () => !!props.activeTab,
  set: (value) => {
    if (!value) {
      emit('update:activeTab', null)
    }
  }
})

const localActiveTab = computed({
  get: () => props.activeTab,
  set: (value) => emit('update:activeTab', value)
})

const closeModal = () => {
  emit('update:activeTab', null)
}
</script>
