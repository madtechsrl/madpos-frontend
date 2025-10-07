import type { Warehouse } from "../types/products"

const mockWarehouses: Warehouse[] = [
  {
    id: "wh1",
    code: "ALM001",
    name: "Almacén Principal",
    description: "Almacén central",
    address: "Zona Industrial Los Mina",
    city: "Santo Domingo",
    manager: "Carlos Rodríguez",
    phone: "809-555-9999",
    capacity: 5000,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wh2",
    code: "PDV001",
    name: "Punto de Venta Centro",
    description: "Tienda del centro",
    address: "Av. Duarte #789",
    city: "Santo Domingo",
    manager: "Ana Martínez",
    phone: "809-555-8888",
    capacity: 500,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function fetchWarehouses(): Promise<Warehouse[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return [...mockWarehouses]
}

export async function createWarehouse(
  warehouse: Omit<Warehouse, "id" | "createdAt" | "updatedAt">,
): Promise<Warehouse> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newWarehouse: Warehouse = {
    ...warehouse,
    id: `wh${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockWarehouses.push(newWarehouse)
  return newWarehouse
}

export async function updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<Warehouse | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockWarehouses.findIndex((w) => w.id === id)
  if (index === -1) return null

  mockWarehouses[index] = {
    ...mockWarehouses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockWarehouses[index]
}

export async function deleteWarehouse(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockWarehouses.findIndex((w) => w.id === id)
  if (index === -1) return false
  mockWarehouses.splice(index, 1)
  return true
}
