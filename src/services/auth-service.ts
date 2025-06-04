import axios from 'axios';
import { handleError } from "../lib/handleError";
import type { User } from "../types/User";
import { ROLES } from '../types/roles';
// import api  from '../lib/api';
// Define types for authentication


// API URL with fallback for preview environment
const api = "http://localhost:8184"

/**
 * Authenticate a user with email and password
 */

// const axiosInstance = axios.create({
//     baseURL: api,
//     withCredentials: true,
    
// });

export const registerAPI = async(fullname: string, email: string,  role: string, enable:string)=>{
    try {
        const response = await axios.post(api + "/v1/auth/sign-up", {
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
        await axios.post(api + "/tokens",datawithToken);
        return datawithToken;  
    }catch (error) {
        handleError(error);
        throw error;
    }

}

export const fetchProfile = async (accessToken: string): Promise<User> => {
  try {
        // console.log("fetchProfile: Sending /v1/auth/profile request with token", accessToken);
    const profileResponse = await axios.get(api + "/v1/auth/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // console.log("fetchProfile: /v1/auth/profile response", profileResponse.data);

    const profileData = profileResponse.data?.data;

    if (!profileData) {
      throw new Error("No profile data received");
        }
    // console.log("fetchProfile: Extracted profile data", {
    //   email: profileData.email,
    //   fullname: profileData.fullname,
    //   role: profileData.role,
    // });

    const user: User = {
      id: profileData.id,
      email: profileData.email,
      fullname: profileData.fullname,
      role: profileData.role,
      enabled: profileData.enabled,
      createdAt: profileData.createdAt,
      password: "",
    };

    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(profileData.role)) {
      console.error(`fetchProfile: Invalid role received: ${profileData.role}`);
      throw new Error("Invalid role received from API");
    }

    return user;
  } catch (profileError: any) {
    console.error("fetchProfile: Profile request failed", {
      message: profileError.message,
      response: profileError.response?.data,
      status: profileError.response?.status,
    });
    if (profileError.message.includes("CORS") || profileError.message.includes("Access to XMLHttpRequest")) {
      throw new Error("CORS policy blocked the profile request. Please check server CORS configuration.");
    }
    throw profileError;
  }
};

export const loginAPI = async (email: string, password: string) => {
    try {
      // Step 1: Authenticate to get token
      // console.log("loginAPI: Sending /v1/auth/sign-in request", { email });
      const loginResponse = await axios.post(api + "/v1/auth/sign-in", { email, password });
      // console.log("loginAPI: /v1/auth/sign-in response", loginResponse.data);
      
      const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.accessToken || loginResponse.data?.token;
      
      if (!accessToken) {
        throw new Error("No access token received from server");
      }
      // console.log("loginAPI: Access token", accessToken);
  
      const user = await fetchProfile(accessToken);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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



// export async function authenticateUser(email: string, password: string): Promise<User | null> {
//     try {
//         const loginResponse = await axios.post(api + "/v1/auth/sign-in", { email, password });
//         const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.accessToken || loginResponse.data?.token;
    
//         if (!accessToken) {
//           throw new Error("No access token received from server");
//         }
    
//         const profileResponse = await axios.get(api + "/v1/auth/profile", {
//           params: { email },
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
    
//         const profileData = profileResponse.data?.data;
    
//         if (!profileData) {
//           throw new Error("No profile data received");
//         }
    
//         const user: User = {
//           id: profileData.id,
//           email: profileData.email,
//           fullname: profileData.fullname,
//           role: profileData.role,
//           enabled: profileData.enabled,
//           createdAt: profileData.createdAt,
//           password: "",
//         };
    
//         return user;
//       } catch (error) {
//         console.error("Error authenticating user:", error);
//         handleError(error);
//         return null;
//       }
// }







