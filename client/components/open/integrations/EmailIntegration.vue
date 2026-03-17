<template>
  <IntegrationWrapper
    v-model="props.integrationData"
    :integration="props.integration"
    :form="form"
  >
    <p class="text-neutral-500 text-sm mb-3">
      You can <a
        class="underline cursor-pointer"
        @click="openEmailsModal"
      >
        use our custom SMTP feature
      </a> to send emails from your own domain.
    </p>

    <MentionInput
      :form="integrationData"
      :mentions="form?.properties || []"
      name="data.send_to"
      required
      label="Send To"
    >
      <template #help>
        <InputHelp>
          Add one email per line
        </InputHelp>
      </template>
    </MentionInput> 
    
    <div class="flex space-x-4">
      <MentionInput
        :form="integrationData"
        :mentions="form?.properties || []"
        name="data.sender_name"
        label="Sender Name"
        class="flex-1"
      />
      <text-input
        v-if="selfHosted"
        :form="integrationData"
        name="data.sender_email"
        label="Sender Email"
        help="If supported by email provider - default otherwise"
        class="flex-1"
      />
    </div>
    
    <MentionInput
      :form="integrationData"
      :mentions="form?.properties || []"
      required
      name="data.subject"
      label="Subject"
    />
    
    <rich-text-area-input
      :form="integrationData"
      :enable-mentions="true"
      :mentions="form?.properties || []"
      name="data.email_content"
      label="Email Content"
    />
    
    <toggle-switch-input
      :form="integrationData"
      name="data.include_submission_data"
      class="mt-4"
      label="Include submission data"
      help="If enabled the email will contain form submission answers"
    />
    
    <toggle-switch-input
      v-if="integrationData.data.include_submission_data"
      :form="integrationData"
      name="data.include_hidden_fields_submission_data"
      class="mt-4"
      label="Include hidden fields"
      help="If enabled the email will contain hidden fields"
    />
    
    <toggle-switch-input
      v-if="form?.editable_submissions"
      :form="integrationData"
      name="data.link_edit_submission"
      class="mt-4"
      label="Edit Submission Link"
    />
    
    <MentionInput
      :form="integrationData"
      :mentions="form?.properties || []"
      class="mt-4"
      name="data.reply_to"
      label="Reply To"
      help="If empty, Reply-to will be your own email."
    />
  </IntegrationWrapper>
</template>

<script setup>
import IntegrationWrapper from "./components/IntegrationWrapper.vue"

const props = defineProps({
  integration: { type: Object, required: true },
  form: { type: Object, required: true },
  integrationData: { type: Object, required: true },
  formIntegrationId: { type: Number, required: false, default: null },
})

const selfHosted = computed(() => useFeatureFlag('self_hosted'))
const { openWorkspaceSettings } = useAppModals()
const { data: user } = useAuth().user()

function openEmailsModal () {
  openWorkspaceSettings('emails')
}

function openSubscriptionModal () {
  useAppModals().openSubscriptionModal({
    modal_title: 'Upgrade to unlock powerful email integration',
    modal_description: 'Upgrade to Pro to customize email notification recipients, send confirmation email to form respondents, and more: form customization, custom domain, collaboration, etc.'
  })
}

onBeforeMount(() => {
  // Lấy user từ URL params hoặc localStorage
  const urlParams = new URLSearchParams(window.location.search)
  
  const userEmail = urlParams.get('user_email') || 
                    localStorage.getItem('crm_user_email') || 
                    user.value?.email || 
                    ''
                    
  const userName = urlParams.get('user_name') || 
                   localStorage.getItem('crm_user_name') || 
                   user.value?.name || 
                   'CRMGO'
  
  // Lưu vào localStorage nếu có từ URL
  if (urlParams.get('user_email')) {
    localStorage.setItem('crm_user_email', urlParams.get('user_email'))
    localStorage.setItem('crm_user_name', urlParams.get('user_name') || '')
  }
  
  console.log('Final user data:', { email: userEmail, name: userName })
  
  for (const [keyname, defaultValue] of Object.entries({
    send_to: userEmail,
    sender_name: userName,
    subject: "We saved your answers",
    email_content: "Hello there 👋 <br>This is a confirmation that your submission was successfully saved.",
    include_submission_data: true,
    include_hidden_fields_submission_data: false,
  })) {
    if (props.integrationData.data[keyname] === undefined) {
      props.integrationData.data[keyname] = defaultValue
    }
  }
})
</script>