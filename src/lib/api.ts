import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8184"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let refreshPromise: Promise<string> | null = null

function clearLocalSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  delete api.defaults.headers.common.Authorization
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if(token && !config.headers.Authorization){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = String(originalRequest?.url || "")
    const isAuthEndpoint =
      requestUrl.includes("/v1/auth/sign-in") ||
      requestUrl.includes("/v1/auth/sign-out") ||
      requestUrl.includes("/v1/auth/refresh-token")
    const hasLocalSession = Boolean(localStorage.getItem("token") || localStorage.getItem("user"))

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint ||
      !hasLocalSession
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/v1/auth/refresh-token")
          .then((response) => {
            const accessToken = response.data?.data?.accessToken
            if (!accessToken) throw new Error("No access token received")
            localStorage.setItem("token", accessToken)
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            return accessToken
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const accessToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      clearLocalSession()
      if (window.location.pathname !== "/") window.location.assign("/")
      return Promise.reject(refreshError)
    }
  },
)

export { clearLocalSession }
export default api
