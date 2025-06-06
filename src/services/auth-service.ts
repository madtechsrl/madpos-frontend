import { handleError } from "../lib/handleError";
import type { User } from "../types/User";
import { ROLES } from '../types/roles';
import axiosInstance  from '../lib/api';

// Define types for authentication


export const registerAPI = async(fullname: string, email: string,  role: string, enable:string)=>{
    try {
        const response = await axiosInstance.post("/v1/auth/sign-up", {
            fullname,
            email,
            role,
            enable  
        });
       
        const datawithToken = {
            token: `fake-jwt-token-${Date.now()}`,
            userName: response.data.userName,
            email: response.data.email,            
        };
        // console.log("datawithToken:", datawithToken);
        await axiosInstance.post("/tokens",datawithToken);
        return datawithToken;  
    }catch (error) {
        handleError(error);
        throw error;
    }

}






export const fetchProfile = async (accessToken: string): Promise<User> => {
  try {
    const res = await axiosInstance.get("/v1/auth/profile", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = res.data?.data;
    if (!data) throw new Error("No profile data received");

    if (!Object.values(ROLES).includes(data.role)) {
      throw new Error(`Invalid role received: ${data.role}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      role: data.role,
      enabled: data.enabled,
      createdAt: data.createdAt,
      password: "",
    };
  } catch (err: any) {
    console.error("fetchProfile error:", err?.response?.data || err.message);
    if (
      err.message.includes("CORS") ||
      err.message.includes("Access to XMLHttpRequest")
    ) {
      throw new Error("CORS blocked profile request — check backend CORS settings.");
    }
    throw err;
  }
};

export const loginAPI = async (email: string, password: string) => {
    try {
      // Step 1: Authenticate to get token
      // console.log("loginAPI: Sending /v1/auth/sign-in request", { email });
      const loginResponse = await axiosInstance.post("/v1/auth/sign-in", { email, password });
      // console.log("loginAPI: /v1/auth/sign-in response", loginResponse.data);
      
      const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.accessToken || loginResponse.data?.token;
      
      if (!accessToken) {
        throw new Error("No access token received from server");
      }
      // console.log("loginAPI: Access token", accessToken);
  
      const user = await fetchProfile(accessToken);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    // Validate role
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