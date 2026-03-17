<template>
  <div class="flex flex-col h-full bg-white">
    <div class="sticky top-0 z-50 bg-white border-b border-neutral-200 p-2 sm:px-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between flex-wrap flex-shrink-0 gap-2 px-2 sm:px-0">
          <h1 class="text-lg font-semibold text-neutral-900">My Form Templates</h1>
          <div class="flex items-center gap-2 w-full justify-end sm:w-auto">
            <!-- Nút View All Templates -->
            <UButton
              @click="navigateTo('/templates')"
              variant="outline"
              color="primary"
              icon="i-heroicons-eye"
              label="View All Templates"
            />
            <UButton
              @click="isModalOpen = true"
              variant="outline"
              color="neutral"
              icon="i-heroicons-question-mark-circle"
              label="How to Create"
            />
          </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div class="max-w-4xl mx-auto">
        <VTransition name="fade">
          
            <templates-list
              v-if="loading || templates?.length > 0"
              grid-classes="grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3"
              :templates="templates"
              :loading="loading"
              :show-types="false"
              :show-industries="false"
            />

          <div v-else class="text-center py-16 px-4">
            <UIcon name="i-heroicons-document-duplicate" class="h-12 w-12 text-neutral-400 mx-auto" />
            <h3 class="mt-4 text-lg font-semibold text-neutral-900">
              No templates yet
            </h3>
            <p class="mt-1 text-sm text-neutral-500">
              You haven't created any templates yet. Create forms and share them as templates!
            </p>
            <UButton
              class="mt-4"
              @click="isModalOpen = true"
              variant="outline"
              color="neutral"
              icon="i-heroicons-question-mark-circle"
              label="How to Create"
            />
          </div>
        </VTransition>
      </div>
    </div>

    <!-- Modal với Teleport - Đẹp như OpnForm -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="isModalOpen" 
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          @click.self="isModalOpen = false"
        >
          <!-- Nền mờ -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden modal-content">
            <!-- Header -->
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
                @click="isModalOpen = false"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6 text-white" />
              </button>
            </div>

            <!-- Body - Scrollable -->
            <div class="flex-1 overflow-y-auto px-6 py-6">
              <p class="text-neutral-600 mb-6 text-base leading-relaxed">
                Creating templates makes your workflow smoother, faster, and more efficient—no need to start from scratch every time! Here's how to do it:
              </p>

              <div class="space-y-6">
                <!-- Step 1 -->
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

                <!-- Step 2 -->
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

                <!-- Step 3 -->
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

                <!-- Step 4 -->
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
                    <!-- Ảnh -->
                    <div class="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4 overflow-hidden hover:border-[#0E90D9] transition-all duration-300 hover:shadow-lg">
                      <img 
                        src="/images/create.png" 
                        alt="Create Template option" 
                        class="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <!-- Step 5 -->
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
                    <!-- Ảnh -->
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

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <UButton
                @click="isModalOpen = false"
                variant="outline"
                size="lg"
                label="Close"
              />
              <UButton
                @click="createNewForm"
                size="lg"
                label="Create Form"
                icon="i-heroicons-plus"
                class="custom-btn"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
})

useOpnSeoMeta({
  title: "My Templates",
  description:
    "Our collection of beautiful templates to create your own forms!",
})

const { list } = useTemplates()

const { data: templates, isLoading: loading } = list({
  params: { onlymy: true }
})

const isModalOpen = ref(false)

const createNewForm = () => {
  isModalOpen.value = false
  navigateTo('/forms/create')
}
</script>

<style scoped>
/* Animation cho modal fade in/out */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Animation cho modal content */
.modal-fade-enter-active .modal-content {
  animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-content {
  animation: modalSlideDown 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modalSlideDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
}

/* Custom button style */
.custom-btn {
  background: linear-gradient(135deg, #0E90D9 0%, #0a74b8 100%) !important;
}

.custom-btn:hover {
  background: linear-gradient(135deg, #0a74b8 0%, #085d94 100%) !important;
}
</style>