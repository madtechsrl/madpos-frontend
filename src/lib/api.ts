
import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL = "http://localhost:8184"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface  RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Manejo de respuestas y refresh token
axiosInstance.interceptors.response.use(
  // ok
  (res: AxiosResponse) => res,
  // error
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    // Si no hay response o no hay request original, rechaza
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    const url = originalRequest.url || "";

    // No intentes refrescar en el propio endpoint de refresh
    const isRefreshCall = url.includes("/v1/auth/refresh-token");

    // Solo intentamos refresh en 401 (no autorizado), una sola vez
    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        // Reutiliza el refresh si ya hay uno en curso
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const { data } = await axiosInstance.post(
              "/v1/auth/refresh-token",
              null,
              { withCredentials: true }
            );

            // Tu backend responde con sendResponse(..., { accessToken })
            // a veces viene en data.data.accessToken, otras data.accessToken:
            const newAccessToken: string =
              data?.data?.accessToken || data?.accessToken;

            if (!newAccessToken) {
              throw new Error("No new access token received");
            }

            localStorage.setItem("token", newAccessToken);
            // setea por defecto para siguientes requests
            axiosInstance.defaults.headers.common["Authorization"] =
              `Bearer ${newAccessToken}`;

            return newAccessToken;
          })()
            .finally(() => {
              // libera la promesa al terminar (éxito o error)
              refreshPromise = null;
            });
        }

        const token = await refreshPromise;

        // inyecta el token nuevo en el reintento
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers["Authorization"] = `Bearer ${token}`;

        // reintenta
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshErr);
      }
    }

    // En 403 (prohibido) o cualquier otro error, no se intenta refresh
    return Promise.reject(error);
  }
);



export default axiosInstance;
