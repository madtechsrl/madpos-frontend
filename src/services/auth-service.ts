import { handleError } from "../lib/handleError";
import type { User } from "../types/User";
import axiosInstance  from '../lib/api';
import { getRoleById, ROLES } from "../types/roles";


export const fetchProfile = async (): Promise<User> => {
  try {
    const res = await axiosInstance.get("/v1/auth/profile");
    const data = res.data?.data;
    if (!data) throw new Error("No profile data received");
    if (!Object.values(ROLES).includes(data.role)) {
      throw new Error(`Invalid role received: ${data.role}`);
    }
    return {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      role: getRoleById(data.role),
      enabled: data.enabled,
      createdAt: data.createdAt,      
    };
  } catch (error) {
    console.error("fetchProfile error:", error);
    handleError(error);
    throw error;
  }
};


export const loginAPI = async (email: string, password: string) => {
  try {
    const loginResponse = await axiosInstance.post("/v1/auth/sign-in", { email, password });
    const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.access
     if (!accessToken) {
      throw new Error("No access token recibido por el server");
    }

    localStorage.setItem("token", accessToken);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const user = await fetchProfile();
    localStorage.setItem("user", JSON.stringify(user));
    return {
      accessToken,
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      createdAt: user.createdAt,
      enabled: user.enabled,
    };
  } catch (error) {
    console.error("loginAPI error:", error);
    handleError(error);
    throw error;
  }
};



export const registerAPI = async (
  fullname: string,
  email: string,
  password: string,
  role: string,
  enabled: boolean
): Promise<boolean> => {
  try {

    // const roleId = getRoleIdByRole(role: UserRole)

    const newUser = {
      fullname,
      email,
      password,
      role,
      // roleId,
      enabled,
      createdAt: new Date().toISOString(),
    };

    const response = await axiosInstance.post("/v1/auth/sign-up", newUser);
    return !!response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    handleError(error);
    return false;
  }
} 



