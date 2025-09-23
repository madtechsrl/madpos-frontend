
import type { Client , CreateClientRequest, UpdateClientRequest, PaginatedClientResponse  } from "../types/Client"
import axiosInstance  from "../lib/api"
import UseAxiosPrivate from "../lib/apiPrivate"


// const checkToken = ()=>{
//   const token = localStorage.getItem("token")
//   if(!token){
//     throw new Error("No token found, cannot fetch users")
//   }
//   // console.log("checkToken: Token found", token)
//   return token
// }




// Get all users
export async function fetchClients(): Promise<PaginatedClientResponse> {
 try {
  const { data } = await axiosInstance.get("/v1/customers");
  return {
    clients: data?.data?.records ?? [],
    totalPages: data?.data?.totalPages ?? 0,
      currentPage: data?.data?.page ?? 1,
      totalRecords: data?.data?.totalRecords ?? 0,
      sortBy: data?.data?.sortBy ?? "",
      order: data?.data?.order ?? "ASC",
  }

 } catch (error) {
  console.error("Error fetching user: ", error)
  return {
      clients: [],
      totalPages: 0,
      currentPage: 1,
      totalRecords: 0,
      sortBy: "",
      order: "ASC"

  } 
 }
}


// Get user by ID
export async function fetchUserById(id: string): Promise<Client | undefined> {
  
  try {
    const { data } = await axiosInstance.get(`/v1/customers/${id}`);
    const client: Client | undefined = data?.data;
    return client 
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return undefined;
  }
}

// Create a new user
export async function createClient(input: CreateClientRequest): Promise<Client> {

const payload = {
  firstName: input.firstName,
  email: input.email,
 
 
}

 const { data } = await axiosInstance.post("/v1/customers", payload);
  const rec: Client = data?.data;
  return (rec);

}

// Update an existing user
export async function updateClient(id: string, updates: UpdateClientRequest): Promise<Client | null> {
  const axiosPrivate = UseAxiosPrivate();
  try {
    const body: UpdateClientRequest = { ...updates };
  
    const { data } = await axiosPrivate.put(`/v1/customers/${id}`, body);
    const rec: Client | undefined = data?.data;
    return rec ? (rec) : null;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  const axiosPrivate = UseAxiosPrivate();
  try {
    await axiosPrivate.delete(`/v1/customers/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
}




