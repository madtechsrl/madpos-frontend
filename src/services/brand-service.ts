import type { Brand } from "../types/products"

const mockBrands: Brand[] = [
  {
    id: "brand1",
    name: "Presidente",
    description: "Cerveza dominicana premium",
    country: "República Dominicana",
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "brand2",
    name: "Brahma",
    description: "Cerveza brasileña",
    country: "Brasil",
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "brand3",
    name: "Corona",
    description: "Cerveza mexicana",
    country: "México",
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function fetchBrands(): Promise<Brand[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return [...mockBrands]
}

export async function createBrand(brand: Omit<Brand, "id" | "createdAt" | "updatedAt">): Promise<Brand> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newBrand: Brand = {
    ...brand,
    id: `brand${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockBrands.push(newBrand)
  return newBrand
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockBrands.findIndex((b) => b.id === id)
  if (index === -1) return null

  mockBrands[index] = {
    ...mockBrands[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockBrands[index]
}

export async function deleteBrand(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockBrands.findIndex((b) => b.id === id)
  if (index === -1) return false
  mockBrands.splice(index, 1)
  return true
}
