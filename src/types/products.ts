export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  parentId?: string
  order: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: string
  name: string
  description?: string
  logo?: string
  country?: string
  website?: string
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  code: string
  name: string
  businessName?: string
  taxId?: string
  email?: string
  phone?: string
  contactPerson?: string
  address?: string
  city?: string
  country?: string
  paymentTerms?: string
  notes?: string
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

export interface Warehouse {
  id: string
  code: string
  name: string
  address?: string
  city?: string
  manager?: string
  phone?: string
  capacity?: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  code: string
  name: string
  description?: string
  categoryId: string
  brandId?: string
  supplierId?: string
  imageUrl?: string
  status: "Activo" | "Inactivo"
  warehouseIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Packaging {
  id: string
  productId: string
  packagingName: string
  barcode: string
  quantityPerPack: number
  unitMeasure: string
  costPrice: number
  salePrice: number
  minStock: number
  maxStock: number
  reorderPoint: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

export interface WarehouseStock {
  id: string
  productId: string
  packagingId: string
  warehouseId: string
  quantity: number
  lastUpdated: string
}

export interface ProductLot {
  id: string
  productId: string
  packagingId: string
  lotNumber: string
  expirationDate?: string
  quantity: number
  warehouseId: string
  createdAt: string
}

export interface InventoryMovement {
  id: string
  productId: string
  packagingId: string
  warehouseId: string
  type: "Entrada" | "Salida" | "Ajuste" | "Transferencia"
  quantity: number
  reason: string
  userId: string
  createdAt: string
}
