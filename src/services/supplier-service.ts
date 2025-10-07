import type { Supplier } from "../types/products"

const mockSuppliers: Supplier[] = [
  {
    id: "sup1",
    code: "SUP001",
    name: "Distribuidora Nacional",
    companyName: "Distribuidora Nacional SRL",
    taxId: "123456789",
    email: "ventas@distnacional.com",
    phone: "809-555-1234",
    address: "Av. 27 de Febrero #123",
    city: "Santo Domingo",
    country: "República Dominicana",
    contactPerson: "Juan Pérez",
    paymentTerms: "30 días",
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup2",
    code: "SUP002",
    name: "Importadora del Caribe",
    companyName: "Importadora del Caribe SA",
    taxId: "987654321",
    email: "info@impcaribe.com",
    phone: "809-555-5678",
    address: "Calle Principal #456",
    city: "Santiago",
    country: "República Dominicana",
    contactPerson: "María García",
    paymentTerms: "15 días",
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function fetchSuppliers(): Promise<Supplier[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return [...mockSuppliers]
}

export async function createSupplier(supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newSupplier: Supplier = {
    ...supplier,
    id: `sup${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockSuppliers.push(newSupplier)
  return newSupplier
}

export async function updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockSuppliers.findIndex((s) => s.id === id)
  if (index === -1) return null

  mockSuppliers[index] = {
    ...mockSuppliers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockSuppliers[index]
}

export async function deleteSupplier(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockSuppliers.findIndex((s) => s.id === id)
  if (index === -1) return false
  mockSuppliers.splice(index, 1)
  return true
}
