import { getDomain, getHost, customDomainUsed } from "~/lib/utils.js"

// Helper để lấy CSRF token
function getCsrfToken() {
  if (process.client) {
    const meta = document.querySelector('meta[name="csrf-token"]')
    return meta?.getAttribute('content') || localStorage.getItem('csrf_token') || ''
  }
  return ''
}

function addAuthHeader(request, options) {
  // XÓA AUTH - vì dùng Laravel session rồi
  // const authStore = useAuthStore()
  // if (authStore.token) {
  //   options.headers = {
  //     Authorization: `Bearer ${authStore.token}`,
  //     ...options.headers,
  //   }
  // }
}

function addPasswordToFormRequest(request, options) {
  if (!request || !request.startsWith("/forms/")) return
  const slug = request.split("/")[2]
  const passwordCookie = useCookie("password-" + slug, {
    maxAge: 60 * 60 * 24 * 30,
  }) // 30 days
  if (slug !== undefined && slug !== "" && passwordCookie.value !== undefined) {
    options.headers["form-password"] = passwordCookie.value
  }
}

function addCustomDomainHeader(request, options) {
  if (!customDomainUsed()) return
  options.headers["x-custom-domain"] = getDomain(getHost())
}

export function getOpnRequestsOptions(request, opts) {
  const config = useRuntimeConfig()
  
  if (opts.body && opts.body instanceof FormData) {
    opts.headers = {
      charset: "utf-8",
      ...opts.headers,
    }
  }
  
  opts.headers = { 
    accept: "application/json",
    'X-CSRF-TOKEN': getCsrfToken(), // THÊM CSRF TOKEN
    ...opts.headers 
  }

  // XÓA API SECRET - không cần nữa
  // if (import.meta.server && config.apiSecret) {
  //   opts.headers["x-api-secret"] = config.apiSecret
  // }

  addAuthHeader(request, opts)
  addPasswordToFormRequest(request, opts)
  addCustomDomainHeader(request, opts)

  if (!opts.baseURL) {
    // DÙNG API LARAVEL CRM
    opts.baseURL = config.public.apiBase // http://127.0.0.1:8000/admin/form-builder
  }
  
  // THÊM credentials để gửi cookie session Laravel
  opts.credentials = 'include'

  return {
    async onResponseError({ response }) {
      const { status } = response
      
      if (status === 401) {
        // 401 = chưa login Laravel -> redirect về login
        if (process.client && window.parent !== window) {
          // Nếu trong iframe, redirect parent window
          window.parent.location.href = '/admin/login'
        } else if (process.client) {
          window.location.href = '/admin/login'
        }
      } else if (status === 420) {
        console.warn("Invalid response from back-end")
      } else if (status >= 500) {
        console.error("Request error", status)
      }
    },
    ...opts,
  }
}

export const opnFetch = (request, opts = {}) => {
  return $fetch(request, getOpnRequestsOptions(request, opts))
}

export const useOpnApi = (request, opts = {}) => {
  return useFetch(request, getOpnRequestsOptions(request, opts))
}
