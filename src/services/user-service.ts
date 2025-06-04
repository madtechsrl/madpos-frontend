// import axiosInstance from "./auth-service"
// import axios from "axios"
import type { User,  } from "../types/User"
import { ROLES } from "../types/roles"
import api from "../lib/api"

const roleMapping: Record<string, string> = {
  "ADMIN": ROLES.ADMIN,
  "CAJERO": ROLES.CAJERO,
  "USUARIO": ROLES.USER,
  "PROPIETARIO": ROLES.PROPIETARIO,
  "ALMACENISTA": ROLES.ALMACENISTA
}

// API URL - actual API endpoint
// const api = "http://localhost:8184"


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
   
    const response = await api.get("/v1/users",{
      headers:{
        Authorization: `Bearer ${accessToken}`
      }
    })

    // console.log("fetchUsers: Response from", api, response.data)

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
    const response = await api.get("/v1/users/${id}")

    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const response = await api.post(`${api}/v1/users`, user)

    return response.data?.data?.records || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Update an existing user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await api.put("/v1/users/${id}", updates)

    return response.data?.data?.records || null

  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await api.delete("/v1/users/${id}")

    return response.data?.data?.records || false
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }
}




