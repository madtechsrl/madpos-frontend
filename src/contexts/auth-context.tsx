import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { CreateUserRequest, User } from "../types/User"
import { mapRoleToUuid, ROLES, type RoleUuid, type RoleKey } from "../types/roles"
import { loginAPI, } from "../services/auth-service"
import { createUser } from "../services/user-service"
import axiosInstance from "../lib/api";


// ---------- Helpers de rol (tipados) ----------

const ROLE_UUIDS = Object.values(ROLES) as RoleUuid[];
const ROLE_KEYS = Object.keys(ROLES) as RoleKey[];

/** Type guard: ¿es uno de los UUID definidos? */
function isRoleUuid(v: string): v is RoleUuid {
  return (ROLE_UUIDS as string[]).includes(v);
}

/** Normaliza cualquier string (“ADMIN” | “MANAGER” | “CASHIER” o UUID) a RoleUuid */
function normalizeRoleUuid(input?: string): RoleUuid {
  if (!input) return ROLES.CASHIER; // fallback seguro
  // mapRoleToUuid acepta código o UUID y devuelve (idealmente) UUID o el mismo string
  const mapped = mapRoleToUuid(input);
  // si es un UUID válido de nuestros roles:
  if (typeof mapped === "string" && isRoleUuid(mapped)) return mapped;
  // si vino como código válido, úsalo para obtener el UUID:
  const upper = input.toUpperCase();
  if ((ROLE_KEYS as string[]).includes(upper)) {
    return ROLES[upper as RoleKey];
  }
  // último recurso: cajero
  return ROLES.CASHIER;
}

// ---------- Tipos del contexto ----------

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: RoleUuid| null;
  token: string | null
  setToken: (token: string | null) => void
  loginUser: (email: string, password: string) => void
  register: (
    fullname: string, 
    email: string, 
    password: string, 
    role: RoleUuid, 
    enabled: boolean ) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: RoleUuid | RoleUuid[]) => boolean
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      if(storedUser && storedToken){
        const parsed : User = JSON.parse(storedUser)
        const roleUuid = normalizeRoleUuid(parsed.role as string);
        setUser({...parsed, role: roleUuid})
        setToken(storedToken)
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer${storedToken}`
      }
    } catch  {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }finally{
      setIsLoading(false)
    }  
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
      
     
      const payload : CreateUserRequest = {
        fullname,
        email,
        password,
        role,               
        enabled,        
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

    const roleCode = normalizeRoleUuid(response.role)
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




  const hasPermission = (requireRole: RoleUuid | RoleUuid[]): boolean => {
    const current = user?.role ? normalizeRoleUuid(user.role) : null
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
        userRole: user?.role ? normalizeRoleUuid(user.role): null,
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