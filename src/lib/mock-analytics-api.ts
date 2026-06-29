import type {
    TopProduct,
    TopCustomer,
    TopSeller,
    HourlySales,
    AnalyticsPeriod,
    SaleRecord,
    SalesHistoryFilters,
  } from "../types/analytics"
  import { transactionsApi } from "../lib/transactions-api"
  
  // Helper function to get date range
  const getDateRange = (period: "today" | "yesterday" | "thisWeek" | "thisMonth") => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
    switch (period) {
      case "today":
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        }
      case "yesterday":
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        return {
          start: yesterday,
          end: today,
        }
      case "thisWeek":
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
          start: weekStart,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        }
      case "thisMonth":
        const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        return {
          start: monthStart,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        }
    }
  }
  
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  
  export const analyticsApi = {
    async getAnalytics(date: Date = new Date(), userId?: string): Promise<AnalyticsPeriod> {
      await delay(500)
  
      // Get all transactions
      const allTransactions = await transactionsApi.getTransactions()
  
      // Filter by user if specified
      const transactions = userId ? allTransactions.filter((t) => t.userId === userId) : allTransactions
  
      // Filter completed sales only
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      const calculatePeriodStats = (period: "today" | "yesterday" | "thisWeek" | "thisMonth") => {
        const { start, end } = getDateRange(period)
        const periodSales = sales.filter((sale) => sale.createdAt >= start && sale.createdAt < end)
  
        const billing = periodSales.reduce((sum, sale) => sum + sale.amount, 0)
        const salesCount = periodSales.length
        const averageTicket = salesCount > 0 ? billing / salesCount : 0
  
        // Calculate profit (assuming 30% margin for demo)
        const profit = billing * 0.3
        const salesRate = billing * 0.15 // Demo calculation
  
        return {
          billing,
          sales: salesCount,
          averageTicket,
          profit,
          salesRate,
          paymentMethodPercentage: 100, // Demo value
          bestMonth: "febrero",
        }
      }
  
      return {
        today: calculatePeriodStats("today"),
        yesterday: calculatePeriodStats("yesterday"),
        thisWeek: calculatePeriodStats("thisWeek"),
        thisMonth: calculatePeriodStats("thisMonth"),
      }
    },
  
    async getTopProducts(limit = 5, userId?: string): Promise<TopProduct[]> {
      await delay(300)
  
      const allTransactions = await transactionsApi.getTransactions()
      const transactions = userId ? allTransactions.filter((t) => t.userId === userId) : allTransactions
  
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      // Group sales by product (using description as proxy for now)
      const productSales: Record<string, { name: string; totalSales: number }> = {}
  
      sales.forEach((sale) => {
        // Extract product info from description (simplified)
        const productName = sale.description.split(" - ")[0] || "Producto"
        if (!productSales[productName]) {
          productSales[productName] = { name: productName, totalSales: 0 }
        }
        productSales[productName].totalSales += sale.amount
      })
  
      return Object.entries(productSales)
        .map(([id, data], index) => ({
          id,
          name: data.name,
          totalSales: data.totalSales,
          rank: index + 1,
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, limit)
    },
  
    async getTopCustomers(limit = 5, userId?: string): Promise<TopCustomer[]> {
      await delay(300)
  
      const allTransactions = await transactionsApi.getTransactions()
      const transactions = userId ? allTransactions.filter((t) => t.userId === userId) : allTransactions
  
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      // Group sales by customer
      const customerSales: Record<string, { name: string; totalPurchases: number }> = {}
  
      sales.forEach((sale) => {
        if (sale.customerId && sale.customerName) {
          if (!customerSales[sale.customerId]) {
            customerSales[sale.customerId] = {
              name: sale.customerName,
              totalPurchases: 0,
            }
          }
          customerSales[sale.customerId].totalPurchases += sale.amount
        }
      })
  
      return Object.entries(customerSales)
        .map(([id, data], index) => ({
          id,
          name: data.name,
          totalPurchases: data.totalPurchases,
          rank: index + 1,
        }))
        .sort((a, b) => b.totalPurchases - a.totalPurchases)
        .slice(0, limit)
    },
  
    async getTopSellers(limit = 5): Promise<TopSeller[]> {
      await delay(300)
  
      const transactions = await transactionsApi.getTransactions()
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      // Group sales by seller
      const sellerSales: Record<string, { name: string; totalSales: number }> = {}
  
      sales.forEach((sale) => {
        if (!sellerSales[sale.userId]) {
          sellerSales[sale.userId] = {
            name: sale.userName,
            totalSales: 0,
          }
        }
        sellerSales[sale.userId].totalSales += sale.amount
      })
  
      return Object.entries(sellerSales)
        .map(([id, data], index) => ({
          id,
          name: data.name,
          totalSales: data.totalSales,
          rank: index + 1,
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, limit)
    },
  
    async getHourlySales(date: Date = new Date(), userId?: string): Promise<HourlySales[]> {
      await delay(400)
  
      const allTransactions = await transactionsApi.getTransactions()
      const transactions = userId ? allTransactions.filter((t) => t.userId === userId) : allTransactions
  
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      // Filter sales for the specific date
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
  
      const daySales = sales.filter((sale) => sale.createdAt >= targetDate && sale.createdAt < nextDate)
  
      // Group by hour
      const hourlySales = Array.from({ length: 24 }, (_, hour) => {
        const hourSales = daySales.filter((sale) => sale.createdAt.getHours() === hour)
        const billing = hourSales.reduce((sum, sale) => sum + sale.amount, 0)
        const salesCount = hourSales.length
        const averageTicket = salesCount > 0 ? billing / salesCount : 0
  
        return {
          hour,
          billing,
          sales: salesCount,
          averageTicket,
        }
      })
  
      // Find best and worst hours
      const maxBilling = Math.max(...hourlySales.map((h) => h.billing))
      const minBilling = Math.min(...hourlySales.filter((h) => h.billing > 0).map((h) => h.billing))
  
      return hourlySales.map((hour) => ({
        ...hour,
        isBestHour: hour.billing === maxBilling && hour.billing > 0,
        isWorstHour: hour.billing === minBilling && hour.billing > 0 && minBilling < maxBilling,
      }))
    },
  
    async getSalesHistory(filters: SalesHistoryFilters = {}): Promise<SaleRecord[]> {
      await delay(600)
  
      const transactions = await transactionsApi.getTransactions()
      const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed")
  
      let filteredSales = sales.map((sale) => ({
        id: sale.id,
        code: sale.reference,
        date: sale.createdAt,
        customer: {
          id: sale.customerId || "",
          name: sale.customerName || "Cliente",
        },
        seller: {
          id: sale.userId,
          name: sale.userName,
        },
        itemsCount: Math.floor(Math.random() * 10) + 1, // Demo value
        total: sale.amount,
        type: "sale" as const,
        observations: sale.description,
        status: "completed" as const,
      }))
  
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredSales = filteredSales.filter(
          (sale) =>
            sale.customer.name.toLowerCase().includes(searchTerm) ||
            sale.seller.name.toLowerCase().includes(searchTerm) ||
            sale.code.toLowerCase().includes(searchTerm),
        )
      }
  
      if (filters.sellerId) {
        filteredSales = filteredSales.filter((sale) => sale.seller.id === filters.sellerId)
      }
  
      if (filters.customerId) {
        filteredSales = filteredSales.filter((sale) => sale.customer.id === filters.customerId)
      }
  
      if (filters.type) {
        filteredSales = filteredSales.filter((sale) => sale.type === filters.type)
      }
  
      return filteredSales.sort((a, b) => b.date.getTime() - a.date.getTime())
    },
  }
  
