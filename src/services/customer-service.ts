import api from "../lib/api"

export type Customer = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  identificationNumber?: string
  fiscalCode?: string
  isActive: boolean
}

export async function fetchCustomers(search = ""): Promise<Customer[]> {
  const response = await api.get("/v1/customers", { params: { limit: 100, name: search || undefined } })
  return response.data.data.records
}

export async function createCustomer(customer: Omit<Customer, "id" | "isActive">): Promise<Customer> {
  const response = await api.post("/v1/customers", { ...customer, isActive: true })
  return response.data.data
}

export async function updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
  const response = await api.put(`/v1/customers/${id}`, customer)
  return response.data.data
}

export async function deactivateCustomer(id: string): Promise<Customer> {
  const response = await api.delete(`/v1/customers/${id}`)
  return response.data.data
}
