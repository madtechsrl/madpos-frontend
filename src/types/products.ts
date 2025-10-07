// ============================================
// CATEGORÍAS
// ============================================
export interface Category {
  id: string
  name: string
  description: string
  parentId?: string // Para categorías anidadas
  icon?: string
  order: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

// ============================================
// MARCAS
// ============================================
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

// ============================================
// SUPLIDORES
// ============================================
export interface Supplier {
  id: string
  code: string
  name: string
  companyName: string
  taxId: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  contactPerson?: string
  paymentTerms?: string
  notes?: string
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

// ============================================
// ALMACENES / WAREHOUSES
// ============================================
export interface Warehouse {
  id: string
  code: string
  name: string
  description?: string
  address: string
  city: string
  manager?: string
  phone?: string
  capacity?: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

// ============================================
// PACKAGING (Presentaciones del Producto)
// ============================================
export interface Packaging {
  id: string
  productId: string
  packagingName: string // Ej: "Unidad", "Six-Pack", "Caja 12", "Caja 24"
  barcode: string
  quantityPerPack: number // Cuántas unidades base contiene
  unitMeasure: string // "Unidad", "Paquete", "Caja", etc.
  costPrice: number
  salePrice: number
  minStock: number
  maxStock: number
  reorderPoint: number
  status: "Activo" | "Inactivo"
  createdAt: string
  updatedAt: string
}

// ============================================
// PRODUCTOS - Modelo Base
// ============================================
export interface Product {
  // Identificación
  id: string
  code: string // SKU principal
  name: string
  description?: string

  // Clasificación
  categoryId: string
  brandId: string
  supplierId?: string

  // Características de bebidas
  alcoholContent?: number
  volume?: number // ml, L (por unidad base)
  volumeUnit?: "ml" | "L" | "oz"
  container?: string // "Botella", "Lata", "Barril"

  // Imágenes
  images: string[]
  primaryImage?: string

  // Packagings/Presentaciones
  packagings: Packaging[]
  defaultPackagingId?: string // Packaging por defecto

  // Stock total (calculado de todas las presentaciones)
  totalStock: number

  // Flags
  featured: boolean
  taxable: boolean
  taxRate?: number
  status: "Activo" | "Inactivo" | "Descontinuado"

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  tags?: string[]
}

// ============================================
// PRODUCTO CON DETALLES COMPLETOS
// ============================================
export interface ProductWithDetails extends Product {
  category?: Category
  brand?: Brand
  supplier?: Supplier
}

// ============================================
// STOCK POR ALMACÉN Y PACKAGING
// ============================================
export interface WarehousePackagingStock {
  id: string
  packagingId: string
  warehouseId: string
  quantity: number
  reserved: number
  available: number
  location?: string
  lastRestockDate?: string
}

// ============================================
// MOVIMIENTOS DE INVENTARIO
// ============================================
export interface InventoryMovement {
  id: string
  productId: string
  packagingId: string
  productName: string
  packagingName: string
  type: "Entrada" | "Salida" | "Ajuste" | "Transferencia" | "Venta" | "Devolución"
  quantity: number
  warehouseId: string
  warehouseName: string
  destinationWarehouseId?: string
  costPrice?: number
  salePrice?: number
  reference?: string
  userId: string
  userName: string
  reason?: string
  notes?: string
  date: string
  createdAt: string
}

// ============================================
// ITEM DEL CARRITO (Actualizado)
// ============================================
export interface CartItem {
  productId: string
  packagingId: string // Ahora es requerido
  productName: string
  packagingName: string
  barcode: string
  quantity: number
  unitPrice: number
  totalPrice: number
  image?: string
}
