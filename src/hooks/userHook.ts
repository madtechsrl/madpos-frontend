// src/hooks/useRefreshToken.ts
import axiosInstance from "../lib/api";
import { useAuth } from "../contexts/auth-context";

type RefreshPayload = { accessToken: string };

// Si tu sendResponse envuelve el payload en { data: ... }
type ApiResponse<T> = { data: T; message?: string };

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  return async (): Promise<string> => {
    const res = await axiosInstance.get<ApiResponse<RefreshPayload> | RefreshPayload>(
      "/v1/auth/refresh-token",
      { withCredentials: true }
    );

    // Soporta ambos formatos: { data: { accessToken } } ó { accessToken }
    const accessToken =
      (res.data as ApiResponse<RefreshPayload>)?.data?.accessToken ??
      (res.data as RefreshPayload)?.accessToken;

    if (!accessToken) {
      console.error("Refresh response shape:", res.data);
      throw new Error("No accessToken en la respuesta de refresh");
    }

    setAuth(prev => ({ ...prev, accessToken }));
    return accessToken;
  };
}
