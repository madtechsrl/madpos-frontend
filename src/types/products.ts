export const ROLES = {
  ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  USER: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  CAJERO: "7c9e6679-7425-40de-944b-e07fc1f907c9",
  ALMACENISTA: "7c9e6679-7425-40de-944b-e07fc1f907ca",
  PROPIETARIO: "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const

export type UserRole = "administrator" | "cashier" | "owner" | "almacenista" | "user"
export type RoleId = (typeof ROLES)[keyof typeof ROLES]

export type Product = {
  id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  price: number
  cost: number
  category: string
  stock: number
  minStock: number
  image?: string
  bgColor?: string
  textColor?: string
  isActive: boolean
  taxable: boolean
  createdAt: string
  updatedAt: string
  createdBy: string // User ID who created this product
}