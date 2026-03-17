<template>
  <div>
    <TrackClick
      name="share_embed_form_popup_click"
      :properties="{
        form_id: form.id,
        form_slug: form.slug,
      }"
    >
      <UButton
        variant="outline"
        color="neutral"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        @click="onOpenClick"
      >
        Embed as popup
      </UButton>
    </TrackClick>

    <UModal
      v-model:open="isModalOpen"
      :ui="{ content: 'sm:max-w-2xl' }"
      title="Add the popup to your website"
      :content="{
        onPointerDownOutside: (event) => { if (event.target?.closest('.nf-main')) {return event.preventDefault()}}
      }"
    >
      <template #body>
        <h3 class="text-xl font-semibold mb-2">
          Demo
        </h3>
        <p class="pb-6">
          A live preview of your form popup was just added to this page.
          <span class="font-semibold text-blue-800">Click on the button on the bottom
            {{ advancedOptions.position }} corner to try it</span>.
        </p>

        <h3 class="border-t text-xl font-semibold mb-2 pt-6">
          How does it work?
        </h3>
        <p>
          Paste the following code snippet in the <b>&lt;head&gt;</b> section of
          your website.
        </p>

        <div class="border border-blue-300 bg-blue-50 dark:bg-notion-dark-light rounded-md p-4 mb-5 w-full mx-auto mt-4 select-all">
          <div class="flex items-center">
            <p class="select-all text-blue-500 flex-grow break-all">
              {{ embedPopupCode }}
            </p>
            <div
              class="hover:bg-blue-100 rounded-sm transition-colors cursor-pointer"
              @click="copyToClipboard"
            >
                <Icon 
                  name="heroicons:clipboard-document" 
                  class="h-6 w-6 text-blue-500" 
                />
            </div>
          </div>
        </div>

        <div class="border-t my-4" />
        <VForm size="sm">
          <h3 class="text-xl font-semibold mb-2">
            Customization
          </h3>
          
          <ColorInput
            v-model="advancedOptions.bgcolor"
            name="bgcolor"
            label="Circle Background Color"
          />
          
          <!-- ✅ EMOJI PICKER - PHIÊN BẢN ĐƠN GIẢN -->
          <div class="mt-4 max-w-xs">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Emoji
            </label>
            <div class="relative">
              <input
                v-model="advancedOptions.emoji"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl text-center"
                @click="toggleEmojiPicker"
                placeholder="💬"
              />
              
              <!-- Emoji Picker Popup -->
              <div
                v-show="showEmojiPicker"
                class="absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
                style="width: 320px;"
                @click.stop
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Select an emoji</span>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600"
                    @click="showEmojiPicker = false"
                  >
                    <Icon name="heroicons:x-mark" class="w-5 h-5" />
                  </button>
                </div>
                <div class="grid grid-cols-8 gap-2">
                  <button
                    v-for="emoji in commonEmojis"
                    :key="emoji"
                    type="button"
                    class="text-2xl hover:bg-gray-100 rounded p-2 transition-colors"
                    @click="selectEmoji(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <FlatSelectInput
            v-model="advancedOptions.position"
            name="position"
            class="mt-4 max-w-xs"
            label="Position"
            :options="[
              { name: 'Bottom Right', value: 'right' },
              { name: 'Bottom Left', value: 'left' },
            ]"
          />
          <TextInput
            v-model="advancedOptions.width"
            name="width"
            class="mt-4 max-w-xs"
            label="Form pop max width (px)"
            native-type="number"
          />
        </VForm>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, onMounted, onBeforeUnmount } from "vue"
import { appUrl } from "~/lib/utils.js"
import TrackClick from "~/components/global/TrackClick.vue"

const { copy } = useClipboard()
const crisp = useCrisp()
const props = defineProps({
  form: { type: Object, required: true },
})

const embedScriptUrl = computed(() => {
  if (import.meta.server) return "/widgets/embed-min.js"
  return window.location.origin + "/widgets/embed-min.js"
})

const showEmbedFormAsPopupModal = ref(false)
const showEmojiPicker = ref(false)

const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
  '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
  '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
  '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯',
  '💬', '💭', '💡', '💯', '🔥', '⭐', '✨', '💫',
  '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉',
  '⚡', '💥', '💢', '💨', '💦', '💧', '💤', '❤️',
  '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍',
  '👋', '👍', '👎', '👏', '🙌', '🙏', '✌️', '🤝',
]

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const selectEmoji = (emoji) => {
  advancedOptions.value.emoji = emoji
  showEmojiPicker.value = false
}

const handleClickOutside = (event) => {
  if (showEmojiPicker.value) {
    const emojiPicker = document.querySelector('.emoji-picker-popup')
    const emojiInput = document.querySelector('.emoji-input')
    
    if (emojiPicker && !emojiPicker.contains(event.target) && 
        emojiInput && !emojiInput.contains(event.target)) {
      showEmojiPicker.value = false
    }
  }
}

onMounted(() => {
  advancedOptions.value.bgcolor = props.form.color
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Modal state
const isModalOpen = computed({
  get() {
    return showEmbedFormAsPopupModal.value
  },
  set(value) {
    if (!value) {
      onClose()
    }
  }
})

const advancedOptions = ref({
  emoji: "💬",
  position: "right",
  bgcolor: "#3B82F6",
  width: "500",
})

const shareUrl = computed(() => {
  return props.form.share_url
})

const embedPopupCode = computed(() => {
  const nfData = {
    formurl: shareUrl.value,
    emoji: advancedOptions.value.emoji,
    position: advancedOptions.value.position,
    bgcolor: advancedOptions.value.bgcolor,
    width: advancedOptions.value.width,
  }
  previewPopup(nfData)
  return (
    "<script async data-nf='" +
    JSON.stringify(nfData) +
    "' src='" +
    embedScriptUrl.value + 
    "'></scrip" +
    "t>"
  )
})

const onClose = () => {
  removePreview()
  crisp.showChat()
  showEmbedFormAsPopupModal.value = false
  showEmojiPicker.value = false
}

const onOpenClick = () => {
  const style = props.form?.presentation_style || 'classic'
  if (style === 'focused') {
    useAlert().warning('Popup mode is not currently supported for forms in Focused mode.')
    return
  }
  showEmbedFormAsPopupModal.value = true
}

const copyToClipboard = () => {
  if (import.meta.server) return
  copy(embedPopupCode.value)
  useAlert().success("Copied!")
}

const removePreview = () => {
  if (import.meta.server) return
  const oldP = document.head.querySelector("#nf-popup-preview")
  if (oldP) {
    oldP.remove()
  }
  const oldM = document.body.querySelector(".nf-main")
  if (oldM) {
    oldM.remove()
  }
}

const previewPopup = (nfData) => {
  if (import.meta.server) return
  if (!showEmbedFormAsPopupModal.value) return

  removePreview()
  crisp.hideChat()

  const scriptUrl = window.location.origin + "/widgets/embed-min.js"
  const el = document.createElement("script")
  el.id = "nf-popup-preview"
  el.async = true
  el.src = scriptUrl
  el.setAttribute("data-nf", JSON.stringify(nfData))
  
  document.head.appendChild(el)
}
</script>
