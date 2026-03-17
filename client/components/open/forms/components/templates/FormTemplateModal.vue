  <template>
    <UModal
      v-model:open="isOpen"
      :ui="{ content: 'sm:max-w-4xl' }"
      v-if="!showGuideModal"
    >
      <template #header>
        <div class="flex items-center w-full gap-4 px-2">
          <h2 class="font-semibold">
            {{ template ? 'Edit Template' : 'Create Template' }}
          </h2>
        </div>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-question-mark-circle"
          size="sm"
          @click="openGuide"
        >
          Help
        </UButton>
      </template>

      <template #body>
        <p v-if="!template" class="mb-4">
          New template will be create from your form:
          <span class="font-semibold">{{ form.title }}</span>.
        </p>

        <v-form
          v-if="templateForm"
          :form="templateForm"
          @submit.prevent="onSubmit"
          @keydown="handleKeydown"
        >
          <div class="space-y-4">
            <toggle-switch-input
              v-if="user && (user.admin || user.template_editor)"
              name="publicly_listed"
              :form="templateForm"
              label="Publicly Listed?"
            />
            <text-input
              name="name"
              :form="templateForm"
              label="Title"
              :required="true"
            />
            <text-input
              name="slug"
              :form="templateForm"
              label="Slug"
              :required="true"
            />
            <text-area-input
              name="short_description"
              :form="templateForm"
              label="Short Description"
              :required="true"
            />
            <rich-text-area-input
              name="description"
              :allow-fullscreen="true"
              :form="templateForm"
              label="Description"
              :required="true"
            />
            <text-input
              name="image_url"
              :form="templateForm"
              label="Image"
              :required="true"
            />
            <select-input
              name="types"
              :form="templateForm"
              label="Types"
              :options="typesOptions"
              :multiple="true"
              :searchable="true"
            />
            <select-input
              name="industries"
              :form="templateForm"
              label="Industries"
              :options="industriesOptions"
              :multiple="true"
              :searchable="true"
            />
            <select-input
              name="related_templates"
              :form="templateForm"
              label="Related Templates"
              :options="templatesOptions"
              :multiple="true"
              :searchable="true"
            />
            <questions-editor
              name="questions"
              :questions="templateForm.questions"
              label="Frequently asked questions"
            />
          </div>
        </v-form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-x-2 w-full">
          <UButton
            color="neutral"
            variant="outline"
            @click="close"
            label="Close"
          />
          <UButton
            v-if="template"
            color="error"
            variant="outline"
            @click="
              useAlert().confirm(
                'Do you really want to delete this template?',
                deleteFormTemplate,
              )
            "
            label="Delete template"
          />
          <div class="grow"/>
          <UButton
            class="px-8 custom-create-btn"
            :loading="createMutation.isPending.value || updateMutation.isPending.value"
            @click="onSubmit"
            :label="template ? 'Update' : 'Create'"
          />
        </div>
      </template>
    </UModal>

    <!-- Modal Hướng Dẫn -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="showGuideModal" 
          class="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          @click.self="closeGuide"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden modal-content">
            <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-200" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <UIcon name="i-heroicons-light-bulb" class="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Save Time with Templates!</h2>
                  <p class="text-sm text-white/90">🎯 Quick guide to get started</p>
                </div>
              </div>
              <button
                @click="closeGuide"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6 text-white" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-6">
              <p class="text-neutral-600 mb-6 text-base leading-relaxed">
                Creating templates makes your workflow smoother, faster, and more efficient—no need to start from scratch every time! Here's how to do it:
              </p>

              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
                    1
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-neutral-900 mb-2 flex items-center gap-2 text-base">
                      <UIcon name="i-heroicons-document-text" class="w-5 h-5" style="color: #0E90D9;" />
                      Create your form
                    </h3>
                    <p class="text-sm text-neutral-600 leading-relaxed">Design it just the way you need.</p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
                    2
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-neutral-900 mb-2 flex items-center gap-2 text-base">
                      <UIcon name="i-heroicons-check-circle" class="w-5 h-5" style="color: #0E90D9;" />
                      Save or publish
                    </h3>
                    <p class="text-sm text-neutral-600 leading-relaxed">Once done, go to your form page in your account.</p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
                    3
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-neutral-900 mb-2 flex items-center gap-2 text-base">
                      <UIcon name="i-heroicons-cursor-arrow-rays" class="w-5 h-5" style="color: #0E90D9;" />
                      Click the three dots
                    </h3>
                    <p class="text-sm text-neutral-600 mb-3 leading-relaxed">You'll find this on the right side of your form.</p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
                    4
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-neutral-900 mb-2 flex items-center gap-2 text-base">
                      <UIcon name="i-heroicons-bookmark" class="w-5 h-5" style="color: #0E90D9;" />
                      Select "Create Template"
                    </h3>
                    <p class="text-sm text-neutral-600 mb-3 leading-relaxed">Instantly save it as a reusable template.</p>
                    <div class="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4 overflow-hidden hover:border-[#0E90D9] transition-all duration-300 hover:shadow-lg">
                      <img 
                        src="/images/create.png" 
                        alt="Create Template option" 
                        class="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md" style="background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%);">
                    5
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-neutral-900 mb-2 flex items-center gap-2 text-base">
                      <UIcon name="i-heroicons-folder-open" class="w-5 h-5" style="color: #0E90D9;" />
                      Access your templates anytime
                    </h3>
                    <p class="text-sm text-neutral-600 mb-3 leading-relaxed">Click on "Templates" on the left side of your dashboard.</p>
                    <div class="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4 overflow-hidden hover:border-[#0E90D9] transition-all duration-300 hover:shadow-lg">
                      <img 
                        src="/images/view.png" 
                        alt="Templates menu location" 
                        class="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <UButton
                @click="closeGuide"
                size="lg"
                label="Got it!"
                class="custom-create-btn"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>

  <script setup>
  import { ref, defineProps, defineEmits, computed, watch, onMounted } from "vue"
  import QuestionsEditor from "./QuestionsEditor.vue"
  import { useTemplateMeta } from "~/composables/data/useTemplateMeta"

  const props = defineProps({
    show: { type: Boolean, required: true },
    form: { type: Object, required: true },
    template: { type: Object, required: false, default: () => {} },
  })

  const router = useRouter()
  const { data: user } = useAuth().user()

  const { list, create, update, remove } = useTemplates()

  const { industries: industriesMap, types: typesMap } = useTemplateMeta()

  const industries = computed(() => [...(industriesMap.value?.values() ?? [])])
  const types = computed(() => [...(typesMap.value?.values() ?? [])])

  const templateForm = ref(null)
  const showGuideModal = ref(false)
  const emit = defineEmits(["close"])

  const isOpen = computed({
    get() {
      return props.show
    },
    set(value) {
      if (!value) {
        close()
      }
    }
  })

  const templatesQuery = list({ enabled: false })

  watch(isOpen, (open) => {
    if (open) {
      templatesQuery.refetch()
    }
  })

  onMounted(() => {
    templateForm.value = useForm(
      props.template ?? {
        publicly_listed: false,
        name: "",
        slug: "",
        short_description: "",
        description: "",
        image_url: "",
        types: [],
        industries: [],
        related_templates: [],
        questions: [],
      },
    )
  })

  const typesOptions = computed(() => {
    return Object.values(types.value).map((type) => {
      return {
        name: type.name,
        value: type.slug,
      }
    })
  })
  const industriesOptions = computed(() => {
    return Object.values(industries.value).map((industry) => {
      return {
        name: industry.name,
        value: industry.slug,
      }
    })
  })
  const templatesOptions = computed(() => {
    if (!templatesQuery.data.value) return []
    return Object.values(templatesQuery.data.value).map((template) => {
      return {
        name: template.name,
        value: template.slug,
      }
    })
  })

  const openGuide = () => {
    showGuideModal.value = true
  }

  const closeGuide = () => {
    showGuideModal.value = false
  }

  const close = () => {
    emit("close")
  }

  const createMutation = create()
  const updateMutation = update()
  const deleteMutation = remove()

  const onSubmit = () => {
    if (props.template) {
      updateFormTemplate()
    } else {
      createFormTemplate()
    }
  }

  const createFormTemplate = () => {
    console.log('Creating template...', {
      name: templateForm.value.name,
      form_id: props.form?.id
    })
    
    templateForm.value.form = props.form
    
    createMutation.mutateAsync(templateForm.value).then((response) => {
      console.log('Template created successfully:', response)
      useAlert().success("Template created successfully")
      
      emit("close")
      
      // Redirect đến My Templates 
      setTimeout(() => {
        console.log('Redirecting to My Templates...')
        navigateTo('/templates/my-templates')
      }, 300)
      
    }).catch((error) => {
      console.error('Error creating template:', error)
      const errorMsg = error.response?.data?.message || error.message || "Không thể tạo template"
      useAlert().error(errorMsg)
    })
  }

  const updateFormTemplate = () => {
    templateForm.value.form = props.form
    updateMutation.mutateAsync({ id: props.template.id, data: templateForm.value }).then(() => {
      useAlert().success("Template updated successfully")
      emit("close")
    }).catch((error) => {
      useAlert().error(error.message)
    })
  }

  const deleteFormTemplate = () => {
    if (!props.template) return
    deleteMutation.mutateAsync(props.template.id).then(() => {
      useAlert().success("Template deleted successfully")
      router.push({ name: "templates" })
      emit("close")
    }).catch((error) => {
      useAlert().error(error.message)
    })
  }

  const handleKeydown = (event) => {
    if (templateForm.value && typeof templateForm.value.onKeydown === 'function') {
      templateForm.value.onKeydown(event)
    }
  }
  </script>