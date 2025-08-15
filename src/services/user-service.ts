
import type { User,  } from "../types/User"
import { ROLES } from "../types/roles"
import axiosInstance from "../lib/api"

const roleMapping: Record<string, string> = {
  "ADMIN": ROLES.ADMIN,
  "CAJERO": ROLES.CAJERO,
  "USUARIO": ROLES.USER,
  "PROPIETARIO": ROLES.PROPIETARIO,
  "ALMACENISTA": ROLES.ALMACENISTA
}

const checkToken = ()=>{
  const token = localStorage.getItem("token")
  if(!token){
    throw new Error("No token found, cannot fetch users")
  }
  // console.log("checkToken: Token found", token)
  return token
}
// Get all users
export async function fetchUsers(): Promise<User[]> {
  const accessToken = checkToken()
  try {
   
    const response = await axiosInstance.get("/v1/users",{
      headers:{
        Authorization: `Bearer ${accessToken}`
      }
    })

    // console.log("fetchUsers: Response from", axiosInstance, response.data)

    const users = response.data?.data?.records || []


    if(!Array.isArray(users)){
      console.error("fetchUsers: Invalid response format. Expected array, got:", users)     
    }
    const mappedUsers = users.map((user: User) => ({
      ...user,
      role: user.role ? roleMapping[user.role.toUpperCase()] : ""
    }))
    // console.log("fetchUsers: Mapped users", mappedUsers)
    return mappedUsers; 
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}



// Get user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await axiosInstance.get(`/v1/users/${id}`)

    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const response = await axiosInstance.post(`${axiosInstance}/v1/users`, user)
    return response.data?.data?.records || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Update an existing user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await axiosInstance.put(`/v1/users/${id}`, updates)

    return response.data?.data?.records || null

  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await axiosInstance.delete(`/v1/users/${id}`)

    return response.data?.data?.records || false
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }
}




