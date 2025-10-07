import type { Packaging } from "../types/products"

const mockPackagings: Packaging[] = [
  {
    id: "pack1",
    productId: "prod1",
    packagingName: "Unidad",
    barcode: "7501234567890",
    quantityPerPack: 1,
    unitMeasure: "Unidad",
    costPrice: 45.0,
    salePrice: 75.0,
    minStock: 50,
    maxStock: 500,
    reorderPoint: 100,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pack2",
    productId: "prod1",
    packagingName: "Six-Pack",
    barcode: "7501234567891",
    quantityPerPack: 6,
    unitMeasure: "Paquete",
    costPrice: 260.0,
    salePrice: 430.0,
    minStock: 20,
    maxStock: 200,
    reorderPoint: 40,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pack3",
    productId: "prod1",
    packagingName: "Caja 12 Unidades",
    barcode: "7501234567892",
    quantityPerPack: 12,
    unitMeasure: "Caja",
    costPrice: 500.0,
    salePrice: 850.0,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 20,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pack4",
    productId: "prod1",
    packagingName: "Caja 24 Unidades",
    barcode: "7501234567893",
    quantityPerPack: 24,
    unitMeasure: "Caja",
    costPrice: 980.0,
    salePrice: 1650.0,
    minStock: 5,
    maxStock: 50,
    reorderPoint: 10,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function fetchPackagingsByProduct(productId: string): Promise<Packaging[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockPackagings.filter((p) => p.productId === productId)
}

export async function fetchPackagingById(id: string): Promise<Packaging | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockPackagings.find((p) => p.id === id) || null
}

export async function createPackaging(
  packaging: Omit<Packaging, "id" | "createdAt" | "updatedAt">,
): Promise<Packaging> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newPackaging: Packaging = {
    ...packaging,
    id: `pack${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockPackagings.push(newPackaging)
  return newPackaging
}

export async function updatePackaging(id: string, updates: Partial<Packaging>): Promise<Packaging | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockPackagings.findIndex((p) => p.id === id)
  if (index === -1) return null

  mockPackagings[index] = {
    ...mockPackagings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockPackagings[index]
}

export async function deletePackaging(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockPackagings.findIndex((p) => p.id === id)
  if (index === -1) return false
  mockPackagings.splice(index, 1)
  return true
}

export async function getPackagingByBarcode(barcode: string): Promise<Packaging | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockPackagings.find((p) => p.barcode === barcode && p.status === "Activo") || null
}
