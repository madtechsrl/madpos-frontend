// apiClient.js
import axios from 'axios';

// Crea una instancia de Axios
const api = axios.create({
  baseURL: 'https://tudominio.com/api', // cambia esto por tu backend
  withCredentials: true, // esto permite enviar cookies automáticamente
});

// 🔒 Variable para trackear si ya se está intentando refrescar
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ⛔️ Interceptor de respuestas
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si es 401 y no es un intento de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Espera a que se resuelva el refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh'); // este endpoint debería generar un nuevo token y setearlo en la cookie
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Aquí puedes hacer logout o redirigir al login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;