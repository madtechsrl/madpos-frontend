import api from "../lib/api"

export type Warehouse = {
  id: string
  name: string
}

export type InventoryPackaging = {
  id: string
  name: string
  factorBase: number
  unitMeasure: string
}

export type InventoryBalance = {
  id: string
  warehouseId: string
  warehouseName: string
  productId: string
  sku: string
  productName: string
  category?: string
  brand?: string
  baseUom: string
  packagings: InventoryPackaging[]
  equivalents: {
    packagingId: string
    name: string
    factorBase: number
    completePackages: number
  }[]
  quantity: number
  reserved: number
  available: number
  updatedAt: string
}

export type InventoryMovement = {
  id: string
  createdAt: string
  warehouseId: string
  warehouse: string
  productId: string
  product: string
  sku: string
  baseUom: string
  packaging?: string
  packageQuantity?: number | null
  factorBase?: number | null
  type: string
  quantity: number
  unitCost?: number | null
  source: string
  notes?: string
}

export async function fetchWarehouses(): Promise<Warehouse[]> {
  const response = await api.get("/v1/warehouses", { params: { limit: 100 } })
  return response.data.data.records
}

export async function fetchInventory(warehouseId: string): Promise<InventoryBalance[]> {
  const response = await api.get("/v1/inventory/balances", { params: { warehouseId } })
  return response.data.data
}

export async function fetchInventoryMovements(
  warehouseId: string,
  productId?: string,
): Promise<InventoryMovement[]> {
  const response = await api.get("/v1/inventory/movements", {
    params: { warehouseId, productId: productId || undefined },
  })
  return response.data.data
}

export async function adjustInventory(payload: {
  warehouseId: string
  productId: string
  packagingId?: string
  quantity: number
  direction: "IN" | "OUT"
  mode: "DELTA" | "COUNT"
  unitCostBase?: number
  notes?: string
}) {
  const response = await api.post("/v1/inventory/adjustments", payload)
  return response.data.data
}
