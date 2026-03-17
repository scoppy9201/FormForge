import { apiService as api } from './base'

export const templatesApi = {
  // My Templates - gọi backend CRM
  list: (params = {}) => {
    // Nếu có params.only_my hoặc không có params → gọi CRM
    if (params.only_my !== false) {
      return api.get("/templates", { params })
    }
    
    // Official Templates - gọi trực tiếp OpnForm API
    return $fetch('https://api.opnform.com/templates', {
      method: 'GET',
      params
    }).then(response => {
      // Transform để match format từ backend
      const templates = response?.data || response || []
      return {
        data: templates.map(t => ({
          ...t,
          is_official: true, // Đánh dấu là official
          name: t.name || t.title, // Map field name
        }))
      }
    })
  },
  
  get: (slug) => api.get(`/templates/${slug}`),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`)
}