import type { Product, Categories } from "../contexts/product-context"
import api from "../lib/api"

export type CatalogOption = {
  id: string
  name: string
}

export type ProductPackaging = {
  id: string
  name: string
  barcode?: string
  factorBase: number
  unitMeasure: string
  contentQuantity?: number
  pricingMode: "FIXED_PRICE" | "MARGIN_FROM_LAST_COST"
  fixedPrice?: number
  marginPct?: number
  minStock?: number
  maxStock?: number
  reorderPoint?: number
  status: number
}

export type ManagedProduct = {
  id: string
  sku: string
  name: string
  baseUom: string
  description?: string
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED"
  category?: CatalogOption
  brand?: CatalogOption
  supplier?: CatalogOption
  packagings: ProductPackaging[]
  createdAt: string
  updatedAt: string
}

export type ProductPayload = {
  sku: string
  name: string
  baseUom: string
  description?: string | null
  status?: ManagedProduct["status"]
  categoryId: string
  brandId: string
  supplierId: string
}

export type SupplierRecord = CatalogOption & {
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  rnc?: string
  isActive: boolean
}

export type SupplierPayload = {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  rnc?: string
  isActive?: boolean
}

export type PackagingPayload = {
  name: string
  barcode?: string | null
  factorBase: number
  unitMeasure: string
  contentQuantity?: number | null
  pricingMode: "FIXED_PRICE"
  fixedPrice: number
  minStock?: number | null
  maxStock?: number | null
  reorderPoint?: number | null
  status?: number
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await api.get("/v1/pos/catalog")
  return response.data.data.records
}

export async function fetchCategories(): Promise<Categories[]> {
  const response = await api.get("/v1/categories", { params: { limit: 100 } })
  return response.data.data.records
}

export async function fetchManagedProducts(): Promise<ManagedProduct[]> {
  const response = await api.get("/v1/products", { params: { limit: 100 } })
  return response.data.data.records
}

export async function fetchManagedProduct(id: string): Promise<ManagedProduct> {
  const response = await api.get(`/v1/products/${id}`)
  return response.data.data
}

export async function createProduct(payload: ProductPayload): Promise<ManagedProduct> {
  const response = await api.post("/v1/products", payload)
  return response.data.data
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<ManagedProduct> {
  const response = await api.put(`/v1/products/${id}`, payload)
  return response.data.data
}

export async function deactivateProduct(id: string): Promise<ManagedProduct> {
  const response = await api.delete(`/v1/products/${id}`)
  return response.data.data
}

export async function createPackaging(productId: string, payload: PackagingPayload) {
  const response = await api.post(`/v1/products/${productId}/packagings`, payload)
  return response.data.data as ProductPackaging
}

export async function updatePackaging(
  productId: string,
  packagingId: string,
  payload: PackagingPayload,
) {
  const response = await api.put(
    `/v1/products/${productId}/packagings/${packagingId}`,
    payload,
  )
  return response.data.data as ProductPackaging
}

export async function deactivatePackaging(productId: string, packagingId: string) {
  const response = await api.delete(`/v1/products/${productId}/packagings/${packagingId}`)
  return response.data.data as ProductPackaging
}

export async function fetchBrands(): Promise<CatalogOption[]> {
  const response = await api.get("/v1/brands/", { params: { limit: 100 } })
  return response.data.data.records
}

export async function fetchSuppliers(): Promise<CatalogOption[]> {
  const response = await api.get("/v1/suppliers", { params: { limit: 100 } })
  return response.data.data.records
}

export async function createBrand(name: string): Promise<CatalogOption> {
  const response = await api.post("/v1/brands/", { name })
  return response.data.data
}

export async function createCategory(name: string): Promise<CatalogOption> {
  const response = await api.post("/v1/categories", { name })
  return response.data.data
}

export async function createSupplier(payload: SupplierPayload): Promise<SupplierRecord> {
  const response = await api.post("/v1/suppliers", payload)
  return response.data.data
}

export async function fetchSupplierRecords(): Promise<SupplierRecord[]> {
  const response = await api.get("/v1/suppliers", { params: { limit: 100 } })
  return response.data.data.records
}

export async function updateSupplier(
  id: string,
  payload: SupplierPayload,
): Promise<SupplierRecord> {
  const response = await api.put(`/v1/suppliers/${id}`, payload)
  return response.data.data
}

export async function deactivateSupplier(
  supplier: SupplierRecord,
): Promise<SupplierRecord> {
  return updateSupplier(supplier.id, { ...supplier, isActive: false })
}
