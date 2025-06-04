import type {
    Transaction,
    TransactionSummary,
    TransactionFilters,
    TransactionType,
    TransactionStatus,
    PaymentMethodType,
  } from "../types/transacion"
  
  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: "txn_001",
      type: "sale",
      status: "completed",
      amount: 167096.26,
      paymentMethod: "cash",
      reference: "#2-2",
      description: "Venta de productos - HECMANUEL",
      customerId: "1",
      customerName: "HECMANUEL",
      userId: "1",
      userName: "Miguel Santana",
      saleId: "sale_001",
      createdAt: new Date("2025-02-21T14:14:00"),
      updatedAt: new Date("2025-02-21T14:14:00"),
    },
    {
      id: "txn_002",
      type: "sale",
      status: "completed",
      amount: 200.0,
      paymentMethod: "card",
      reference: "#2-1",
      description: "Venta de productos - HECMANUEL",
      customerId: "1",
      customerName: "HECMANUEL",
      userId: "1",
      userName: "Miguel Santana",
      saleId: "sale_002",
      createdAt: new Date("2025-02-19T19:19:00"),
      updatedAt: new Date("2025-02-19T19:19:00"),
      metadata: {
        cardLast4: "4532",
        authCode: "123456",
        terminalId: "TERM001",
      },
    },
    {
      id: "txn_003",
      type: "refund",
      status: "completed",
      amount: -50.0,
      paymentMethod: "cash",
      reference: "REF-001",
      description: "Reembolso parcial - Producto defectuoso",
      customerId: "2",
      customerName: "Juan Pérez",
      userId: "1",
      userName: "Miguel Santana",
      createdAt: new Date("2025-02-20T10:30:00"),
      updatedAt: new Date("2025-02-20T10:30:00"),
    },
    {
      id: "txn_004",
      type: "adjustment",
      status: "completed",
      amount: 25.0,
      paymentMethod: "cash",
      reference: "ADJ-001",
      description: "Ajuste de caja - Diferencia de inventario",
      userId: "1",
      userName: "Miguel Santana",
      createdAt: new Date("2025-02-18T16:45:00"),
      updatedAt: new Date("2025-02-18T16:45:00"),
    },
    {
      id: "txn_005",
      type: "sale",
      status: "failed",
      amount: 150.0,
      paymentMethod: "card",
      reference: "#2-3",
      description: "Venta fallida - Tarjeta declinada",
      customerId: "3",
      customerName: "María González",
      userId: "2",
      userName: "Ana López",
      createdAt: new Date("2025-02-21T11:20:00"),
      updatedAt: new Date("2025-02-21T11:20:00"),
      metadata: {
        cardLast4: "1234",
        authCode: "DECLINED",
      },
    },
  ]
  
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  
  export const transactionsApi = {
    async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
      await delay(600)
  
      let filteredTransactions = [...mockTransactions]
  
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredTransactions = filteredTransactions.filter(
          (transaction) =>
            transaction.reference.toLowerCase().includes(searchTerm) ||
            transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.customerName?.toLowerCase().includes(searchTerm) ||
            transaction.userName.toLowerCase().includes(searchTerm),
        )
      }
  
      if (filters.type) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.type === filters.type)
      }
  
      if (filters.status) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === filters.status)
      }
  
      if (filters.paymentMethod) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.paymentMethod === filters.paymentMethod,
        )
      }
  
      if (filters.userId) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.userId === filters.userId)
      }
  
      if (filters.dateFrom) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.createdAt >= filters.dateFrom!)
      }
  
      if (filters.dateTo) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.createdAt <= filters.dateTo!)
      }
  
      return filteredTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },
  
    async getTransactionById(id: string): Promise<Transaction | null> {
      await delay(300)
      return mockTransactions.find((transaction) => transaction.id === id) || null
    },
  
    async getTransactionSummary(filters: TransactionFilters = {}): Promise<TransactionSummary> {
      await delay(400)
  
      const transactions = await this.getTransactions(filters)
  
      const summary: TransactionSummary = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        byPaymentMethod: {} as Record<PaymentMethodType, { count: number; amount: number }>,
        byType: {} as Record<TransactionType, { count: number; amount: number }>,
        byStatus: {} as Record<TransactionStatus, { count: number; amount: number }>,
      }
  
      // Initialize counters
      const paymentMethods: PaymentMethodType[] = ["cash", "card", "transfer", "check", "credit"]
      const types: TransactionType[] = ["sale", "return", "refund", "adjustment", "payment"]
      const statuses: TransactionStatus[] = ["completed", "pending", "cancelled", "failed"]
  
      paymentMethods.forEach((method) => {
        summary.byPaymentMethod[method] = { count: 0, amount: 0 }
      })
  
      types.forEach((type) => {
        summary.byType[type] = { count: 0, amount: 0 }
      })
  
      statuses.forEach((status) => {
        summary.byStatus[status] = { count: 0, amount: 0 }
      })
  
      // Calculate summaries
      transactions.forEach((transaction) => {
        summary.byPaymentMethod[transaction.paymentMethod].count++
        summary.byPaymentMethod[transaction.paymentMethod].amount += transaction.amount
  
        summary.byType[transaction.type].count++
        summary.byType[transaction.type].amount += transaction.amount
  
        summary.byStatus[transaction.status].count++
        summary.byStatus[transaction.status].amount += transaction.amount
      })
  
      return summary
    },
  
    async createTransaction(data: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
      await delay(800)
  
      const newTransaction: Transaction = {
        ...data,
        id: `txn_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  
      mockTransactions.unshift(newTransaction)
      return newTransaction
    },
  
    async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
      await delay(500)
  
      const transactionIndex = mockTransactions.findIndex((t) => t.id === id)
      if (transactionIndex === -1) {
        throw new Error("Transacción no encontrada")
      }
  
      mockTransactions[transactionIndex].status = status
      mockTransactions[transactionIndex].updatedAt = new Date()
  
      return mockTransactions[transactionIndex]
    },
  }
  