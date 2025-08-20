import { useState, useEffect, useCallback } from "react"

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
    category: string
    quantity: number
    totalSales: number
    rank: number
    revenue: number
    percentage: number
  }
  
  export interface TopCustomer {
    id: string
    name: string
    email: string
    orders: number
    revenue: number
    percentage: number
    lastOrder: string
    totalPurchases: number
    rank: number
  }
  
  export interface TopSeller {
    id: string
    name: string
    sales: number
    revenue: number
    averageTicket: number
    totalSales: number
    rank: number
  }
  export interface AnalyticsSummary {
  today: {
    billing: number
    sales: number
    averageTicket: number
    customers: number
    
  }
  yesterday: {
    billing: number
    sales: number
    averageTicket: number
    customers: number
    
  }
  growth: {
    billing: number
    sales: number
    customers: number
    
  }
}
  export interface HourlySales {
    hour: number
    billing: number
    sales: number
    averageTicket: number
    isBestHour?: boolean
    isWorstHour?: boolean
  }

export interface DailySales {
  date: string
  billing: number
  sales: number
  averageTicket: number
  customers: number
}

export interface WeeklySales {
  week: string
  billing: number
  sales: number
  averageTicket: number
  customers: number
}

export interface MonthlySales {
  month: string
  billing: number
  sales: number
  averageTicket: number
  customers: number
}

export interface AnalyticsSummary {
  current: {
    billing: number
    sales: number
    averageTicket: number
    customers: number
    date: Date
  }
  previous: {
    billing: number
    sales: number
    averageTicket: number
    customers: number
    date: Date
  }
  growth: {
    billing: number
    sales: number
    customers: number    
  }
  
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
  

  export type TimePeriod = "hora" | "dia" | "semana" | "mes"


  export function useAnalytics(userId?: string, date?: Date, period: TimePeriod = "dia") {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [topSellers, setTopSellers] = useState<TopSeller[]>([])
  const [hourlySales, setHourlySales] = useState<HourlySales[]>([])
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [weeklySales, setWeeklySales] = useState<WeeklySales[]>([])
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateMockData = useCallback((targetDate: Date, selectedPeriod: TimePeriod, selectedUserId?: string) => {
    // Generate different data based on user selection
    const userMultiplier = selectedUserId && selectedUserId !== "all" ? 0.3 : 1 // Individual users have less sales
    const baseRevenue = 125000 * userMultiplier
    const baseSales = 45 * userMultiplier
    const baseCustomers = 32 * userMultiplier

    const mockAnalytics: AnalyticsSummary = {
      current: {
        billing: baseRevenue + (Math.random() - 0.5) * 20000,
        sales: Math.floor(baseSales + (Math.random() - 0.5) * 10),
        averageTicket: 0,
        customers: Math.floor(baseCustomers + (Math.random() - 0.5) * 8),
        date: targetDate
      },
      previous: {
        billing: baseRevenue * 0.85 + (Math.random() - 0.5) * 15000,
        sales: Math.floor(baseSales * 0.9 + (Math.random() - 0.5) * 8),
        averageTicket: 0,
        customers: Math.floor(baseCustomers * 0.88 + (Math.random() - 0.5) * 6),
        date: new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)
      },
      growth: {
        billing: 0,
        sales: 0,
        customers: 0,
      },
      today: {
        billing: baseRevenue + (Math.random() - 0.5) * 10000,
        sales: Math.floor(baseSales + (Math.random() - 0.5) * 5),
        averageTicket: 0,
        customers: Math.floor(baseCustomers + (Math.random() - 0.5) * 4),
        
      },
      yesterday: {
    billing: baseRevenue * 0.9 + (Math.random() - 0.5) * 8000,
    sales: Math.floor(baseSales * 0.95 + (Math.random() - 0.5) * 4),
    averageTicket: 0,
    customers: Math.floor(baseCustomers * 0.92 + (Math.random() - 0.5) * 3),
   
  },
    }

    // Calculate average tickets and growth
    mockAnalytics.current.averageTicket =
      mockAnalytics.current.sales > 0 ? mockAnalytics.current.billing / mockAnalytics.current.sales : 0
    mockAnalytics.previous.averageTicket =
      mockAnalytics.previous.sales > 0 ? mockAnalytics.previous.billing / mockAnalytics.previous.sales : 0

    mockAnalytics.growth.billing =
      ((mockAnalytics.current.billing - mockAnalytics.previous.billing) / mockAnalytics.previous.billing) * 100
    mockAnalytics.growth.sales =
      ((mockAnalytics.current.sales - mockAnalytics.previous.sales) / mockAnalytics.previous.sales) * 100
    mockAnalytics.growth.customers =
      ((mockAnalytics.current.customers - mockAnalytics.previous.customers) / mockAnalytics.previous.customers) * 100

    // Generate hourly data
    const mockHourlySales: HourlySales[] = Array.from({ length: 24 }, (_, i) => {
      const sales = selectedPeriod === "hora" ? Math.floor(Math.random() * 8 * userMultiplier) : 0
      const billing = sales * (2000 + Math.random() * 3000)
      return {
        hour: i,
        billing,
        sales,
        averageTicket: sales > 0 ? billing / sales : 0,
        isBestHour: false,
        isWorstHour: false,
      }
    }).filter((h) => h.sales > 0)

    // Mark best and worst hours
    if (mockHourlySales.length > 0) {
      const maxBilling = Math.max(...mockHourlySales.map((h) => h.billing))
      const minBilling = Math.min(...mockHourlySales.map((h) => h.billing))

      mockHourlySales.forEach((hour) => {
        if (hour.billing === maxBilling) hour.isBestHour = true
        if (hour.billing === minBilling) hour.isWorstHour = true
      })
    }

    // Generate daily data for week/month views
    const mockDailySales: DailySales[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(targetDate)
      date.setDate(date.getDate() - i)
      const sales = Math.floor(Math.random() * 50 * userMultiplier)
      const billing = sales * (2500 + Math.random() * 2000)
      const customers = Math.floor(sales * 0.7)

      return {
        date: date.toISOString().split("T")[0],
        billing,
        sales,
        averageTicket: sales > 0 ? billing / sales : 0,
        customers,
      }
    }).reverse()

    // Generate weekly data
    const mockWeeklySales: WeeklySales[] = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date(targetDate)
      weekStart.setDate(weekStart.getDate() - i * 7)
      const sales = Math.floor(Math.random() * 300 * userMultiplier)
      const billing = sales * (2500 + Math.random() * 2000)
      const customers = Math.floor(sales * 0.6)

      return {
        week: `Semana ${12 - i}`,
        billing,
        sales,
        averageTicket: sales > 0 ? billing / sales : 0,
        customers,
      }
    })

    // Generate monthly data
    const mockMonthlySales: MonthlySales[] = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(targetDate)
      monthDate.setMonth(monthDate.getMonth() - i)
      const sales = Math.floor(Math.random() * 1200 * userMultiplier)
      const billing = sales * (2500 + Math.random() * 2000)
      const customers = Math.floor(sales * 0.5)

      return {
        month: monthDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
        billing,
        sales,
        averageTicket: sales > 0 ? billing / sales : 0,
        customers,
      }
    }).reverse()

    const mockTopProducts: TopProduct[] = [
      {
        id: "1",
        name: "Alphazap",
        category: "Electrónicos",
        quantity: Math.floor(15 * userMultiplier),
        revenue: 185115 * userMultiplier,
        percentage: 35.2,
        rank: 2,
        totalSales: 4,
      },
      {
        id: "2",
        name: "Fix San",
        category: "Automotriz",
        quantity: Math.floor(8 * userMultiplier),
        revenue: 98499 * userMultiplier,
        percentage: 28.7,
        rank: 3,
        totalSales: 6
      },
      {
        id: "3",
        name: "Cardify",
        category: "Software",
        quantity: Math.floor(22 * userMultiplier),
        revenue: 27106 * userMultiplier,
        percentage: 18.1,
        rank: 4,
        totalSales: 4
      },
      {
        id: "4",
        name: "Holdlamis",
        category: "Hogar",
        quantity: Math.floor(12 * userMultiplier),
        revenue: 45230 * userMultiplier,
        percentage: 12.5,
        rank: 5,
        totalSales: 3
      },
      {
        id: "5",
        name: "Rank",
        category: "Deportes",
        quantity: Math.floor(6 * userMultiplier),
        revenue: 15890 * userMultiplier,
        percentage: 5.5,
        rank: 6,
        totalSales: 2
      },
    ]

    const mockTopCustomers: TopCustomer[] = [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        orders: Math.floor(5 * userMultiplier),
        revenue: 15240.5 * userMultiplier,
        lastOrder: "2024-01-15",
        rank: 1,
        percentage: 10,
        totalPurchases: 4

      },
      {
        id: "2",
        name: "María García",
        email: "maria@example.com",
        orders: Math.floor(3 * userMultiplier),
        revenue: 8750.25 * userMultiplier,
        lastOrder: "2024-01-14",
        rank: 2,
        percentage: 11,
        totalPurchases: 4
      },
      {
        id: "3",
        name: "Carlos López",
        email: "carlos@example.com",
        orders: Math.floor(7 * userMultiplier),
        revenue: 22100.75 * userMultiplier,
        lastOrder: "2024-01-13",
        rank: 3,
        percentage: 11,
        totalPurchases: 4
      },
    ]

    const mockTopSellers: TopSeller[] =
      selectedUserId && selectedUserId !== "all"
        ? [
            {
              id: selectedUserId,
              name: "Usuario Seleccionado",
              sales: Math.floor(25 * userMultiplier),
              revenue: 67500.75 * userMultiplier,
              averageTicket: 2700.03,
              rank: 1,
              totalSales: 23
            },
          ]
        : [
            {
              id: "1",
              name: "Carlos Vendedor",
              sales: Math.floor(25 * userMultiplier),
              revenue: 67500.75 * userMultiplier,
              averageTicket: 2700.03,
              rank: 2,
              totalSales: 23
            },
            {
              id: "2",
              name: "Ana Cajera",
              sales: Math.floor(20 * userMultiplier),
              revenue: 57499.25 * userMultiplier,
              averageTicket: 2874.96,
              rank: 3,
              totalSales: 23
            },
            {
              id: "3",
              name: "Luis Supervisor",
              sales: Math.floor(30 * userMultiplier),
              revenue: 82100.5 * userMultiplier,
              averageTicket: 2736.68,
              rank: 4,
              totalSales: 23
            },
          ]

    return {
      mockAnalytics,
      mockHourlySales,
      mockDailySales,
      mockWeeklySales,
      mockMonthlySales,
      mockTopProducts,
      mockTopCustomers,
      mockTopSellers,
    }
  }, [])

  const fetchData = useCallback(
    async (targetDate?: Date, selectedPeriod: TimePeriod = "dia") => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const currentDate = targetDate || new Date()
        const {
          mockAnalytics,
          mockHourlySales,
          mockDailySales,
          mockWeeklySales,
          mockMonthlySales,
          mockTopProducts,
          mockTopCustomers,
          mockTopSellers,
        } = generateMockData(currentDate, selectedPeriod, userId)

        setAnalytics(mockAnalytics)
        setHourlySales(mockHourlySales)
        setDailySales(mockDailySales)
        setWeeklySales(mockWeeklySales)
        setMonthlySales(mockMonthlySales)
        setTopProducts(mockTopProducts)
        setTopCustomers(mockTopCustomers)
        setTopSellers(mockTopSellers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading analytics")
      } finally {
        setLoading(false)
      }
    },
    [userId, generateMockData],
  )

  useEffect(() => {
    fetchData(date, period)
  }, [fetchData, date, period])

  const refetch = useCallback(
    (targetDate?: Date, selectedPeriod: TimePeriod = "dia") => {
      fetchData(targetDate, selectedPeriod)
    },
    [fetchData],
  )

  return {
    analytics,
    topProducts,
    topCustomers,
    topSellers,
    hourlySales,
    dailySales,
    weeklySales,
    monthlySales,
    loading,
    error,
    refetch,
  }
}
