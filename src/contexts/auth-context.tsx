import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "../types/User"
import { loginAPI } from "../services/auth-service"
import axios from "axios";
import { createUser } from "../services/user-service"
import { ROLES } from "../types/roles" 
// import api from "../lib/api";

const api = "http://localhost:8184"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: typeof ROLES[keyof typeof ROLES] | null
  token: string | null
  setToken: (token: string | null) => void
  loginUser: (email: string, password: string) => void
  register: (name: string, email: string, password: string, role: string, enabled: boolean ) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: string | string[]) => boolean
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    const StoredToken = localStorage.getItem("token");
    if (storeUser && StoredToken) {
      const parserUser = JSON.parse(storeUser);        
      setUser(parserUser);
      setToken(StoredToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${StoredToken}`;
    }
    setIsLoading(false);
  }, []);


  const register = async (
    fullname: string,
    email: string,
    password: string,
    role: string,
    enabled: boolean,
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      const newUser: Omit<User, "id"> = {
        fullname,
        email,
        password,
        role,
        enabled,
        createdAt: new Date().toISOString(),
      }

      const createdUser = await createUser(newUser)
      return !!createdUser
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }



// Login function
const loginUser = async (email: string, password: string) => {
   
  try {
    setIsLoading(false);    
    // console.log("loginUser: email", { email } );
    const response = await loginAPI(email, password);
    // console.log("loginUser : token data",{
    //   email: token.email,
    //   fullname: token.fullname,
    //   role: token.role,      
    // })    
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);        
      const userObj: User = {        
        id: response.id, 
        fullname: response.fullname, 
        email: response.email,
        password: "",
        role: response.role as typeof ROLES[keyof typeof ROLES],          
        enabled: true,    
        createdAt:""
      };      
      localStorage.setItem("user", JSON.stringify(userObj));       
      setUser(userObj);      
      setToken(response.accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.accessToken}`; 
      // console.log("loginUser: axios.defaults.headers.common", axios.defaults.headers.common);
      navigate("/dashboard");
    }
  } catch (e) {
    console.error('Login error:', e);
    setIsLoading(true);
  }
};

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")    
    setUser(null);
    setIsAuthenticated(false); 
    axios.post(api + "/v1/auth/sign-out").catch((error)=>{
      console.error("Logout error:", error);
    })   
    navigate("/")
  }

  // Helper function to check if user has required role(s)
  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }
    return user.role === requiredRole
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role as typeof ROLES[keyof typeof ROLES] | null,
        loginUser,
        logout,
        register,
        hasPermission,
        token,
        setToken,
        getAccessToken: () => token,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}