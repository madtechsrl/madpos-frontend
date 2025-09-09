import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { CreateUserRequest, User } from "../types/User"
import { getRoleIdByName, mapUuidToRole,UserRole } from "../types/roles"
import { loginAPI, } from "../services/auth-service"
import { createUser } from "../services/user-service"
import axiosInstance from "../lib/api";


// ---- Helpers ----
/** Acepta string (UUID o "ADMIN" | "MANAGER" | "CASHIER") y devuelve siempre UserRole */
function normalizeRoleCode(input?: string): UserRole {
  if (!input) return UserRole.CASHIER; // fallback seguro
  const upper = input.toUpperCase();
  // ¿Vino como código?
  if ((Object.values(UserRole) as string[]).includes(upper)) {
    return upper as UserRole;
  }
  // Si no, asumimos UUID
  return mapUuidToRole(input);
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole| null
  token: string | null
  setToken: (token: string | null) => void
  loginUser: (email: string, password: string) => void
  register: (name: string, email: string, password: string, role: UserRole, enabled: boolean ) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    const StoredToken = localStorage.getItem("token");
    if (storeUser && StoredToken) {
      try {
     const parsed: User = JSON.parse(storeUser)
     const roleCode: UserRole = parsed.role as UserRole;
     setUser({...parsed, role: roleCode});
     setToken(StoredToken);
     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${StoredToken}`
        
      } catch{
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }     
    }
    setIsLoading(false);
  }, []);


  const register = async (
    fullname: string,
    email: string,
    password: string,
    role: UserRole,
    enabled: boolean,
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      // const roleId = user.role ? getRoleIdByRole(user.role) : ROLES.USER

      // const newUser: Omit<User, "id"> = {
      //   fullname,
      //   email,
      //   password,
      //   role,
      //   roleId,
      //   enabled,
      //   createdAt: new Date().toISOString(),
      // }
     
      const payload : CreateUserRequest = {
        fullname,
        email,
        password,
        role,
        roleId: getRoleIdByName(role),
        enabled,
        createdAt: new Date().toISOString(),
      }

      const createdUser = await createUser(payload)       
      return !!createdUser
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }


  type LoginResponse ={
    accessToken: string;
    id:string;
    email:string;
    fullname: string;
    role: string;
    createdAt: string;
  }


// Login function
const loginUser = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);   
  try {    
    // console.log("loginUser: email", { email } );
    const response = (await loginAPI (email, password)) as LoginResponse;
    // console.log("loginUser : token data",{
    //   email: token.email,
    //   fullname: token.fullname,
    //   role: token.role,      
    // })  

    const roleCode = normalizeRoleCode(response.role)
    const accessToken = response.accessToken;  
    if (accessToken ) {
      localStorage.setItem("token", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
      setToken(accessToken)
    }

      const userObj: User = {        
        id: response.id, 
        fullname: response.fullname, 
        email: response.email,
        password: "",
        role:roleCode,          
        enabled: true,    
        createdAt: response.createdAt ?? "",
      };    
          
      localStorage.setItem("user", JSON.stringify(userObj))
      setUser(userObj);      
      // setToken(accessToken);
      // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.accessToken}`; 
      // console.log("loginUser: axios.defaults.headers.common", axios.defaults.headers.common);
      navigate("/home");
    }catch (e) {
    console.error('Login error:', e);
    setIsLoading(true);
  }finally{setIsLoading(false)}
};



const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setUser(null);
  setUser(null);
  delete axiosInstance.defaults.headers.common["Authorization"];
  document.cookie = "auth-token=; path=/; max-age=0"
  document.cookie = "user-role=; path=/; max-age=0"
  // setIsAuthenticated(false)
  navigate("/")
}


  // // Helper function to check if user has required role(s)
  // const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
  //   if (!user?.role) return false
  //   // if (Array.isArray(requiredRole)) {
  //   //   return requiredRole.includes(user.role)
  //   // }
  //   // return user.role === requiredRole
  //   return Array.isArray(requiredRole)
  //   ? requiredRole.includes(current)
  //   : user.role === requiredRole;

  // }

  const hasPermission = (requireRole: UserRole | UserRole[]): boolean => {
    const current = user?.role;
    if(!current) return false;
    return Array.isArray(requireRole)
    ? requireRole.includes(current)
    : current === requireRole
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role ?? null,
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