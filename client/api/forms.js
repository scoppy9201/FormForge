import { apiService } from './base'

export const formsApi = {
  // Form views
  view: (slug, options) => apiService.get(`/f/${slug}/view`, options),

  // Form operations - ĐỔI SANG API LARAVEL CRM
  list: (workspaceId, options) => apiService.get(`/api/forms`, options),
  get: (slug, options) => apiService.get(`/${slug}`, options),
  getById: (id, options) => apiService.get(`/${id}`, options),
  publicGet: (slug, options) => apiService.get(`/f/${slug}`, options),
  publicGetById: (id, options) => apiService.get(`/f/${id}`, options),
  
  create: (data) => apiService.post('/', data),
  update: (id, data) => apiService.put(`/${id}`, data),
  delete: (id) => apiService.delete(`/${id}`),
  duplicate: (id) => apiService.post(`/${id}/duplicate`),

  // Form utilities
  regenerateLink: (id, option) => apiService.put(`/${id}/regenerate-link/${option}`),
  mobileEditorEmail: (id) => apiService.get(`/${id}/mobile-editor-email`),
  updateWorkspace: (id, workspaceId, data) => apiService.post(`/${id}/workspace/${workspaceId}`, data),

  // Form submissions
  submissions: {
    list: (formId, options) => apiService.get(`/${formId}/submissions`, options),
    get: (slug, submissionId, options) => apiService.get(`/f/${slug}/submissions/${submissionId}`, options),
    update: (formId, submissionId, data) => apiService.put(`/${formId}/submissions/${submissionId}`, data),
    delete: (formId, submissionId) => apiService.delete(`/${formId}/submissions/${submissionId}`),
    deleteMulti: (formId, submissionIds) => apiService.post(`/${formId}/submissions/multi`, { submissionIds }),
    export: (formId, data) => apiService.post(`/${formId}/export`, data),
    exportStatus: (formId, jobId) => apiService.get(`/${formId}/submissions/export/status/${jobId}`),
    answer: (slug, data, options) => apiService.post(`/f/${slug}/submit`, data, options)
  },

  // Form stats
  stats: (workspaceId, formId, options) => apiService.get(`/${formId}/analytics`, options),
  statsDetails: (workspaceId, formId, options) => apiService.get(`/${formId}/analytics`, options),

  // File operations
  assets: {
    upload: (data, options) => apiService.post('/assets/upload', data, options),
    view: (formId, filename, options) => apiService.get(`/${formId}/uploaded-file/${filename}`, options)
  },

  // AI form generation (giữ nguyên vì chưa có trong CRM)
  ai: {
    generate: (data) => apiService.post('/forms/ai/generate', data),
    generateFields: (data) => apiService.post('/forms/ai/generate-fields', data),
    get: (generationId, options) => apiService.get(`/forms/ai/${generationId}`, options)
  },

  // Stripe/Payment (giữ nguyên)
  stripe: {
    getAccount: (slug, options) => apiService.get(`/f/${slug}/stripe-connect/get-account`, options),
    createPaymentIntent: (slug, data) => apiService.post(`/f/${slug}/stripe-connect/payment-intent`, data)
  },

  // Integrations
  integrations: {
    list: (formId, options) => apiService.get(`/${formId}/integrations`, options),
    create: (formId, data) => apiService.post(`/${formId}/integrations`, data),
    update: (formId, integrationId, data) => apiService.put(`/${formId}/integrations/${integrationId}`, data),
    delete: (formId, integrationId) => apiService.delete(`/${formId}/integrations/${integrationId}`),
    events: (formId, integrationId, options) => apiService.get(`/${formId}/integrations/${integrationId}/events`, options)
  },

  // Zapier webhooks
  zapier: {
    store: (data) => apiService.post('/webhooks/zapier', data),
    delete: (id) => apiService.delete(`/webhooks/zapier/${id}`)
  }
}
