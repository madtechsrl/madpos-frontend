
import type { User , CreateUserRequest, UpdateUserRequest  } from "../types/User"
import {ROLES, type RoleKey, type RoleUuid } from "../types/roles"
import axiosInstance  from "../lib/api"
import { mapRoleToUuid, mapUuidToRoleName } from "../types/roles"
import UseAxiosPrivate from "../lib/apiPrivate"




/** Usuario normalizado para la UI */
export interface NormalizedUser extends User {
  roleUuid: RoleUuid;
  roleName: RoleKey;
}

/** Normaliza salida (UI → API) */
function normalizeOutgoingRole(role?: RoleKey | RoleUuid): RoleUuid {
  if (!role) return ROLES.CASHIER;
  const out = mapRoleToUuid(role);
  return (Object.values(ROLES) as string[]).includes(out)
    ? (out as RoleUuid)
    : ROLES.CASHIER;
}

/** Normaliza entrada (API → UI) */
function normalizeIncomingUser(apiUser: User): NormalizedUser {
  const roleUuid = (apiUser.role ?? "") as RoleUuid;
  const roleName = roleUuid ? mapUuidToRoleName(roleUuid) : "";

  return {
    ...apiUser,
    role: roleUuid,
    roleUuid,
    roleName: roleName || ("CASHIER" as RoleKey),
  };
}


// const checkToken = ()=>{
//   const token = localStorage.getItem("token")
//   if(!token){
//     throw new Error("No token found, cannot fetch users")
//   }
//   // console.log("checkToken: Token found", token)
//   return token
// }
// Get all users
export async function fetchUsers(): Promise<NormalizedUser[]> {


 try {
  const { data } = await axiosInstance.get('/v1/users');
  const users: User[] = data?.data?.records ?? []
  return users.map(normalizeIncomingUser);

 } catch (error) {
  console.error("Error fetching user: ", error)
  return [];  
 }
}


// Get user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  
  try {
    const { data } = await axiosInstance.get(`/v1/users/${id}`);
    const user: User | undefined = data?.data;
    return user ? normalizeIncomingUser(user) : null;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null;
  }
}

// Create a new user
export async function createUser(input: CreateUserRequest): Promise<NormalizedUser> {

const payload = {
  fullname: input.fullname,
  email: input.email,
  password: input.password,
  role: normalizeOutgoingRole(input.role),
  enabled: input.enabled ?? true
}

 const { data } = await axiosInstance.post("/v1/users", payload);
  const rec: User = data?.data;
  return normalizeIncomingUser(rec);

}

// Update an existing user
export async function updateUser(id: string, updates: UpdateUserRequest): Promise<NormalizedUser | null> {
  const axiosPrivate = UseAxiosPrivate();
  try {
    const body: UpdateUserRequest = { ...updates };
    if (updates.role) {
      body.role = normalizeOutgoingRole(updates.role);
    }

    const { data } = await axiosPrivate.put(`/v1/users/${id}`, body);
    const rec: User | undefined = data?.data;
    return rec ? normalizeIncomingUser(rec) : null;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  const axiosPrivate = UseAxiosPrivate();
  try {
    await axiosPrivate.delete(`/v1/users/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
}




