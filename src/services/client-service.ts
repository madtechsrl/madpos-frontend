
import type { Client , CreateClientRequest, UpdateClientRequest, PaginatedClientResponse  } from "../types/Client"
import axiosInstance  from "../lib/api"




// Get all users
export async function fetchClients(page:number, limit:number): Promise<PaginatedClientResponse> {
 try {
  const queryParams : string[] = [];  
  if(page !== undefined)queryParams.push(`page=${page}`);
  if(limit !== undefined)queryParams.push(`limit=${limit}`);
  const queryString = queryParams.length > 0 ? `${queryParams.join("&")}` : "";

  // console.log("fetching", `/v1/customers?${queryString}`)
  const { data } = await axiosInstance.get(`/v1/customers?${queryString}`);
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

try {
  const payload = { 
  firstName: input.firstName,
  lastName: input.lastName,
  email: input.email,
  phone:input.phone,
  address: input.address,
  identificationNumber: input.identificationNumber,
  fiscalCode: input.fiscalCode,
  isActive: true,
 
}

 const { data } = await axiosInstance.post("/v1/customers", payload);
 const rec: Client = data?.data;
 return rec
} catch (error: any) {
  console.error("Error del CreateClient", error.response?.data || error.message)
  throw error;
}

}

// Update an existing user
export async function updateClient(id: string, updates: UpdateClientRequest): Promise<Client | null> {
  try {
    const body: UpdateClientRequest = { ...updates };
  
    const { data } = await axiosInstance.put(`/v1/customers/${id}`, body);
    const rec: Client | undefined = data?.data;
    return rec ? (rec) : null;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

// Delete a user
export async function deleteClient(id: string): Promise<boolean> {
  try {
    await axiosInstance.delete(`/v1/customers/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
}

export async function searchClients(query: string): Promise<Client []> {
  try {
    if(!query.trim()) return []

    const {data}= await axiosInstance.get(`/v1/customers?search=${encodeURIComponent(query)}`);

    const clients: Client[] = data?.data?.records ?? [];
    return clients
  } catch (error) {
    console.error("Error consiguiendo Clients", error);
    return [];
  }
  
}


