import type { Category } from "../types/products"

const mockCategories: Category[] = [
  {
    id: "cat1",
    name: "Cervezas",
    description: "Cervezas nacionales e importadas",
    order: 1,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat2",
    name: "Vinos",
    description: "Vinos tintos, blancos y rosados",
    order: 2,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat3",
    name: "Licores",
    description: "Ron, vodka, whisky y más",
    order: 3,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat4",
    name: "Refrescos",
    description: "Bebidas sin alcohol",
    order: 4,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function fetchCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return [...mockCategories].sort((a, b) => a.order - b.order)
}

export async function createCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newCategory: Category = {
    ...category,
    id: `cat${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockCategories.push(newCategory)
  return newCategory
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockCategories.findIndex((c) => c.id === id)
  if (index === -1) return null

  mockCategories[index] = {
    ...mockCategories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockCategories[index]
}

export async function deleteCategory(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockCategories.findIndex((c) => c.id === id)
  if (index === -1) return false
  mockCategories.splice(index, 1)
  return true
}
