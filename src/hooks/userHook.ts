// hooks/useRefreshToken.ts
import axiosInstance from "../lib/api";
import {useAuth }from "../contexts/auth-context";

interface RefreshTokenResponse {
  accessToken: string;
}

const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const { data } = await axiosInstance.get<RefreshTokenResponse>(
      "/v1/auth/refresh-token",
      { withCredentials: true }
    );

    setAuth(prev => ({ ...prev, accessToken: data.accessToken }));
    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;

