export interface SalesStats {
    billing: number
    sales: number
    averageTicket: number
    profit: number
    salesRate: number
    paymentMethodPercentage: number
    bestMonth: string
  }
  
  export interface TopProduct {
    id: string
    name: string
    totalSales: number
    rank: number
  }
  
  export interface TopCustomer {
    id: string
    name: string
    totalPurchases: number
    rank: number
  }
  
  export interface TopSeller {
    id: string
    name: string
    totalSales: number
    rank: number
  }
  
  export interface HourlySales {
    hour: number
    billing: number
    sales: number
    averageTicket: number
    isBestHour?: boolean
    isWorstHour?: boolean
  }
  
  export interface AnalyticsPeriod {
    today: SalesStats
    yesterday: SalesStats
    thisWeek: SalesStats
    thisMonth: SalesStats
  }
  
  export interface SaleRecord {
    id: string
    code: string
    date: Date
    customer: {
      id: string
      name: string
    }
    seller: {
      id: string
      name: string
    }
    itemsCount: number
    total: number
    type: "sale" | "return" | "exchange"
    observations?: string
    status: "completed" | "pending" | "cancelled"
  }
  
  export interface SalesHistoryFilters {
    search?: string
    sellerId?: string
    customerId?: string
    dateFrom?: Date
    dateTo?: Date
    type?: "sale" | "return" | "exchange"
  }
  