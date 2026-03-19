<template>
  <div class="p-4 space-y-8">
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <!-- Cảnh báo trạng thái -->
      <UAlert
        v-if="form.visibility === 'draft'"
        icon="i-heroicons-information-circle"
        color="warning"
        variant="subtle"
        title="Biểu mẫu nháp"
        description="Chỉ bạn mới có thể truy cập link này khi đã đăng nhập."
      />
      <UAlert
        v-else-if="form.visibility === 'closed'"
        icon="i-heroicons-lock-closed"
        color="warning"
        variant="subtle"
        title="Biểu mẫu đã đóng"
        description="Mọi người có thể truy cập nhưng không thể gửi phản hồi mới."
      />

      <!-- Chia sẻ link -->
      <UCard class="shadow">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-xl grow font-semibold">Chia sẻ biểu mẫu</h2>
            <AdvancedFormUrlSettingsPopover
              v-model="shareFormConfig"
              :form="props.form"
            />
          </div>
          <p class="text-neutral-600 text-sm">
            Chia sẻ biểu mẫu với mọi người bằng cách sao chép link bên dưới.
          </p>
          <CopyContent
            :content="share_url"
            :is-draft="form.visibility == 'draft'"
            class="w-full"
          />
          <div class="flex gap-2 pt-2">
            <SocialShareButton :form="props.form" :share-url="share_url" />
            <FormQrCode :form="props.form" :extra-query-param="shareUrlForQueryParams" />
          </div>
        </div>
      </UCard>

      <div class="flex gap-2">
        <UrlFormPrefill :form="props.form" :extra-query-param="shareUrlForQueryParams" />
        <RegenerateFormLink :form="props.form" />
      </div>

      <!-- Gắn chiến dịch -->
      <UCard class="shadow-sm">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold grow">Chiến dịch</h2>
            <UBadge v-if="selectedCampaign" color="green" variant="subtle">
              Đã gắn chiến dịch
            </UBadge>
          </div>
          <p class="text-neutral-600 text-sm">
            Gắn biểu mẫu này vào một chiến dịch để theo dõi lead và hiệu quả thu thập dữ liệu.
          </p>

          <p v-if="loadingCampaigns" class="text-sm text-neutral-500">
            Đang tải danh sách chiến dịch...
          </p>
          <p v-else-if="!loadingCampaigns && campaigns.length === 0" class="text-sm text-neutral-500">
            Chưa có chiến dịch nào. Hãy tạo chiến dịch trước.
          </p>

          <!-- Dropdown style giống CopyContent -->
          <div class="flex gap-2">
            <div class="flex-1 truncate border border-neutral-300 rounded-md px-2 py-1 flex-grow bg-neutral-100 relative">
              <select
                v-model="selectedCampaignId"
                class="w-full bg-transparent text-neutral-900 text-sm focus:outline-none appearance-none cursor-pointer"
              >
                <option :value="null">-- Không gắn chiến dịch --</option>
                <option v-for="c in campaigns" :key="c.id" :value="c.id">
                  {{ c.name }} {{ c.status === 'active' ? '· Đang chạy' : c.status === 'draft' ? '· Nháp' : '· Tạm dừng' }}
                </option>
              </select>
            </div>
            <div class="shrink-0 flex gap-2">
              <UButton
                :color="savedSuccess ? 'success' : 'primary'"
                :icon="savedSuccess ? 'i-heroicons-check' : 'i-heroicons-bookmark'"
                :loading="savingCampaign"
                :disabled="selectedCampaignId === originalCampaignId"
                @click="assignCampaign"
              >
                <span class="hidden md:inline">{{ savedSuccess ? 'Đã lưu!' : 'Lưu' }}</span>
              </UButton>
              <UButton
                v-if="selectedCampaignId"
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="removeCampaign"
              >
                <span class="hidden md:inline">Bỏ gắn</span>
              </UButton>
            </div>
          </div>

          <!-- Link kèm chiến dịch -->
          <div v-if="selectedCampaign" class="space-y-2">
            <p class="text-xs font-medium text-neutral-500">🔗 Link chia sẻ kèm chiến dịch:</p>
            <CopyContent :content="campaignShareUrl" label="Sao chép" class="w-full" />
          </div>
        </div>
      </UCard>

      <!-- Nhúng biểu mẫu -->
      <UCard class="shadow-sm">
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Nhúng biểu mẫu</h2>
          <p class="text-neutral-600 text-sm">
            Nhúng biểu mẫu vào website của bạn bằng cách sao chép mã HTML bên dưới.
          </p>
          <EmbedCode
            :form="props.form"
            :extra-query-param="embedQueryParams"
          />
          <EmbedFormAsPopupModal :form="props.form" class="max-w-fit" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import EmbedCode from "~/components/pages/forms/show/EmbedCode.vue"
import FormQrCode from "~/components/pages/forms/show/FormQrCode.vue"
import UrlFormPrefill from "~/components/pages/forms/show/UrlFormPrefill.vue"
import AdvancedFormUrlSettingsPopover from "~/components/pages/forms/show/AdvancedFormUrlSettingsPopover.vue"
import SocialShareButton from "~/components/pages/forms/show/SocialShareButton.vue"
import EmbedFormAsPopupModal from "~/components/pages/forms/show/EmbedFormAsPopupModal.vue"
import CopyContent from "~/components/open/forms/components/CopyContent.vue"

const props = defineProps({
  form: { type: Object, required: true },
})

definePageMeta({
  middleware: "auth",
})

useOpnSeoMeta({
  title: props.form ? "Chia sẻ - " + props.form.title : "Chia sẻ biểu mẫu",
})

// Cấu hình chia sẻ
const shareFormConfig = ref({ auto_submit: false })

const shareUrlForQueryParams = computed(() => {
  let queryStr = ""
  for (const [key, value] of Object.entries(shareFormConfig.value)) {
    if (value && value !== "false" && value !== false) {
      queryStr += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value)
    }
  }
  return queryStr.slice(1)
})

const share_url = computed(() => {
  return shareUrlForQueryParams.value
    ? props.form.share_url + "?" + shareUrlForQueryParams.value
    : props.form.share_url + shareUrlForQueryParams.value
})

// Chiến dịch
const campaigns = ref([])
const loadingCampaigns = ref(false)
const savingCampaign = ref(false)
const savedSuccess = ref(false)
const selectedCampaignId = ref(props.form.campaign_id ?? null)
const originalCampaignId = ref(props.form.campaign_id ?? null)

const selectedCampaign = computed(() =>
  campaigns.value.find(c => c.id === selectedCampaignId.value) ?? null
)

const campaignShareUrl = computed(() => {
  if (!selectedCampaign.value) return share_url.value
  const base = props.form.share_url
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}campaign_id=${selectedCampaign.value.id}`
})

const embedQueryParams = computed(() => {
  let params = shareUrlForQueryParams.value
  if (selectedCampaign.value) {
    const sep = params ? '&' : ''
    params += `${sep}campaign_id=${selectedCampaign.value.id}`
  }
  return params
})

const fetchCampaigns = async () => {
  loadingCampaigns.value = true
  try {
    const res = await fetch('/api/form-builder/campaigns', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
    campaigns.value = await res.json()
  } catch (e) {
    console.error('Lỗi tải chiến dịch:', e)
  } finally {
    loadingCampaigns.value = false
  }
}

const assignCampaign = async () => {
  savingCampaign.value = true
  try {
    const res = await fetch(`/api/form-builder/${props.form.id}/assign-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? ''
      },
      body: JSON.stringify({ campaign_id: selectedCampaignId.value })
    })
    if (res.ok) {
      originalCampaignId.value = selectedCampaignId.value
      savedSuccess.value = true
      setTimeout(() => { savedSuccess.value = false }, 2000)
      useToast().add({ title: 'Đã lưu chiến dịch thành công!', color: 'green' })
    } else {
      useToast().add({ title: 'Lỗi khi lưu chiến dịch', color: 'red' })
    }
  } catch (e) {
    useToast().add({ title: 'Lỗi kết nối', color: 'red' })
  } finally {
    savingCampaign.value = false
  }
}

const removeCampaign = async () => {
  selectedCampaignId.value = null
  await assignCampaign()
}

onMounted(() => {
  fetchCampaigns()
})
</script>