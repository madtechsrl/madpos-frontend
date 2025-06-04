export interface Product {
    id: string
    name: string
    code: string
    price: number
    cost: number
    promotionalPrice?: number
    category: string
    stock: number
    minStock?: number
    description?: string
    image?: string
    labelName?: string
    unit: string
    isActive: boolean
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Category {
    id: string
    name: string
    description?: string
  }
  
  export interface Sale {
    id: string
    products: SaleItem[]
    total: number
    subtotal: number
    tax: number
    discount: number
    paymentMethod: "cash" | "card" | "transfer"
    customerId?: string
    userId: string
    createdAt: Date
  }
  
  export interface SaleItem {
    productId: string
    product: Product
    quantity: number
    unitPrice: number
    total: number
  }
  
  export interface Customer {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    totalPurchases: number
  }
  
  export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "cashier"
    avatar?: string
  }
  
  export interface StockMovement {
    id: string
    productId: string
    type: "in" | "out" | "adjustment"
    quantity: number
    reason: string
    userId: string
    createdAt: Date
  }
  
  export interface DashboardStats {
    totalSales: number
    totalRevenue: number
    totalProfit: number
    averageTicket: number
    salesCount: number
    topProducts: Array<{
      product: Product
      totalSold: number
      revenue: number
    }>
    topCustomers: Array<{
      customer: Customer
      totalSpent: number
    }>
    salesByHour: Array<{
      hour: number
      sales: number
      revenue: number
    }>
  }
  