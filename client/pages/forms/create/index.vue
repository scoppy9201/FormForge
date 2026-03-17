<template>
  <div class="flex flex-wrap flex-col flex-grow">
    <div
      key="2"
      class="w-full flex flex-grow flex-col"
    >
      <create-form-base-modal
        :show="showInitialFormModal"
        @form-generated="formGenerated"
        @close="showInitialFormModal = false"
      />

      <VTransition name="fade">
        <FormEditor
          v-if="form"
          ref="editor"
          class="w-full flex flex-grow"
          :error="error"
          :is-guest="false"
          @on-save="formInitialHash = null"
        />
      </VTransition>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue"
import { initForm } from "~/composables/forms/initForm.js"
import FormEditor from "~/components/open/forms/components/FormEditor.vue"
import CreateFormBaseModal from "../../../components/pages/forms/create/CreateFormBaseModal.vue"
import { hash } from "~/lib/utils.js"
import { onBeforeRouteLeave } from "vue-router"

definePageMeta({
  middleware: "auth",
  layout: 'empty'
})

useOpnSeoMeta({
  title: "Create a new Form",
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty()) {
      if (window.confirm('Changes you made may not be saved. Are you sure want to leave?')) {
        window.onbeforeunload = null
        next()
      } else {
        next(false)
      }
    }
  next()
})

const route = useRoute()
const workingFormStore = useWorkingFormStore()

const template = ref(null)
if (route.query.template) {
  const { data, suspense } = useTemplates().detail(route.query.template)
  await suspense()
  template.value = data.value
}

const { current: workspace } = useCurrentWorkspace()
const { content: form } = storeToRefs(workingFormStore)

// Pre-load forms list for the current workspace
const workspaceId = computed(() => workspace.value?.id)
useFormsList(workspaceId, {
  enabled: computed(() => !!workspaceId.value)
})

// State
const loading = ref(false)
const error = ref("")
const showInitialFormModal = ref(false)
const formInitialHash = ref(null)

// Watch workspace và update form khi có
watch(
  () => workspace.value,
  (newWorkspace) => {
    if (newWorkspace && form.value) {
      console.log('Workspace loaded:', newWorkspace)
      form.value.workspace_id = newWorkspace.id
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (import.meta.client) {
    window.onbeforeunload = () => {
      if (isDirty()) {
        return false
      }
    }
  }
  
  // Init form - workspace có thể chưa load
  const workspaceId = workspace.value?.id || null
  console.log('Init form with workspace:', workspaceId)
  
  form.value = initForm({ 
    workspace_id: workspaceId, 
    no_branding: workspace.value?.is_pro || true 
  }, true)
  
  formInitialHash.value = hash(JSON.stringify(form.value.data()))

  if (template.value && template.value.structure) {
    const templateData = template.value.structure
    
    // Extract form fields from template
    const templateFields = templateData.properties || templateData.structure || []
    
    console.log('Loading template:', {
      template_name: template.value.name || template.value.title,
      has_fields: templateFields.length > 0,
      fields_count: templateFields.length
    })
    
    // Copy ALL settings from template
    form.value = useForm({
      ...form.value.data(),
      
      // Basic info
      title: templateData.title || template.value.name || 'Untitled Form',
      description: templateData.description || template.value.description || '',

      properties: templateFields,
      
      // Theme settings
      theme: templateData.theme || 'default',
      color: templateData.color || null,
      dark_mode: templateData.dark_mode || 'auto',
      width: templateData.width || 'centered',
      size: templateData.size || 'md',
      
      // Submission settings
      submit_button_text: templateData.submit_button_text || 'Submit',
      submitted_text: templateData.submitted_text || 'Thank you for your submission!',
      redirect_url: templateData.redirect_url || null,
      
      // Features
      confetti_on_submission: templateData.confetti_on_submission || false,
      show_progress_bar: templateData.show_progress_bar !== false,
      use_captcha: templateData.use_captcha || false,
      auto_save: templateData.auto_save || false,
      no_branding: workspace.value?.is_pro || templateData.no_branding || false,
      can_be_indexed: templateData.can_be_indexed !== false,
      
      // Presentation style
      presentation_style: templateData.presentation_style || 'classic',
      
      // Keep workspace_id
      workspace_id: form.value.workspace_id
    })
    
    console.log('Template loaded into form:', {
      fields_count: form.value.properties?.length || 0,
      title: form.value.title
    })
  } else {
    showInitialFormModal.value = true
  }
})

// Methods
const formGenerated = (newForm) => {
  form.value = useForm({ ...form.value.data(), ...newForm })
}

const isDirty = () => {
  return (
    !loading.value &&
    formInitialHash.value &&
    formInitialHash.value !== hash(JSON.stringify(form.value.data()))
  )
}
</script>