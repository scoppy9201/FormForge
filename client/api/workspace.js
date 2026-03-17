import { apiService } from './base'

export const workspaceApi = {
  // Workspace operations - ĐỔI SANG API CRM
  list: (options) => {
    // Gọi API CRM trả về workspace ảo từ user
    return apiService.get('/workspaces/current', options).then(workspace => {
      // Wrap thành array vì OpenForm expect array
      return [workspace]
    })
  },
  
  get: (workspaceId) => {
    // Trả về workspace ảo
    return apiService.get('/workspaces/current')
  },
  
  // Các method khác không cần thiết cho CRM - return empty
  create: (data) => Promise.reject(new Error('Not supported in CRM')),
  update: (workspaceId, data) => Promise.reject(new Error('Not supported in CRM')),
  delete: (workspaceId) => Promise.reject(new Error('Not supported in CRM')),
  leave: (workspaceId) => Promise.reject(new Error('Not supported in CRM')),
  
  // User management - không cần
  users: {
    list: (workspaceId, options) => Promise.resolve([]),
    add: (workspaceId, data) => Promise.reject(new Error('Not supported in CRM')),
    remove: (workspaceId, userId) => Promise.reject(new Error('Not supported in CRM')),
    updateRole: (workspaceId, userId, data) => Promise.reject(new Error('Not supported in CRM'))
  },
  
  // Invite management - không cần
  invites: {
    list: (workspaceId, options) => Promise.resolve([]),
    resend: (workspaceId, inviteId) => Promise.reject(new Error('Not supported in CRM')),
    cancel: (workspaceId, inviteId) => Promise.reject(new Error('Not supported in CRM'))
  },
  
  // Custom domains - không cần
  customDomains: {
    update: (workspaceId, data) => Promise.reject(new Error('Not supported in CRM'))
  }
}
