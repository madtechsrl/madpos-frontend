export interface Product  {
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
  createdBy: string 
}