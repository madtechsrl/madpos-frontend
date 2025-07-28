
import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = "http://localhost:8184"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers['Authorization'] = `Bearer ${token}`;
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   res => res,
//   async (err) => {
//     const originalRequest = err.config;
//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const { data } = await axiosInstance.post('/v1/auth/refresh-token');
//         const newAccessToken = data?.accessToken;
//         if (!newAccessToken) throw new Error("No new access token received");

//         localStorage.setItem("token", newAccessToken);
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//         return axiosInstance(originalRequest); // Retry the original request
//       } catch (refreshError) {
//         console.error("Refresh failed", refreshError);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         window.location.href = "/";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(err);
//   }
// );

axiosInstance.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/v1/auth/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosInstance.post("/v1/auth/refresh-token", null, {
          withCredentials: true,
        });

        const newAccessToken = data?.data?.accessToken || data?.accessToken;
        if (!newAccessToken) throw new Error("No new access token received");

        localStorage.setItem("token", newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);



export default axiosInstance;
