// Tắt hoàn toàn auth check - allow all access
export default defineNuxtRouteMiddleware(async () => {
  // Skip authentication
  return
})
