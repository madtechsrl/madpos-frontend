import axios, { AxiosError, AxiosHeaders } from "axios";
import { useEffect } from "react";
import useRefreshToken from "../hooks/userHook";
import { useAuth } from "../contexts/auth-context";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8184";

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface CustomConfig {
  headers?: AxiosHeaders | Record<string, string>;
  sent?: boolean;
  [key: string]: unknown;
}

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers?.['Authorization']) {
          if (config.headers) {
            config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
          }
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Logging para debugging - remover en producción
        console.log('🚨 Error interceptado:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data
        });

        const prevRequest = error?.config as CustomConfig;
        
        // Verificar códigos de error de autenticación (incluyendo los personalizados del backend)
        const isAuthError = [401, 403, 498, 499].includes(error?.response?.status || 0);
        
        if (isAuthError && !prevRequest?.sent) {
          console.log('🔄 Intentando refresh token...');
          prevRequest.sent = true;
          
          try {
            const newAccessToken: string = await refresh();
            
            if (prevRequest.headers) {
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            }
            
            console.log('✅ Token refrescado, reintentando request...');
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.log('❌ Error al refrescar token:', refreshError);
            // Aquí puedes redirigir al login si es necesario
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;