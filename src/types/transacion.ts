export type TransactionType = "sale" | "return" | "refund" | "adjustment" | "payment"
export type TransactionStatus = "completed" | "pending" | "cancelled" | "failed"
export type PaymentMethodType = "cash" | "card" | "transfer" | "check" | "credit"

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  paymentMethod: PaymentMethodType
  reference: string
  description: string
  customerId?: string
  customerName?: string
  userId: string
  userName: string
  saleId?: string
  createdAt: Date
  updatedAt: Date
  metadata?: {
    cardLast4?: string
    authCode?: string
    batchNumber?: string
    terminalId?: string
  }
}

export interface TransactionSummary {
  totalTransactions: number
  totalAmount: number
  byPaymentMethod: Record<PaymentMethodType, { count: number; amount: number }>
  byType: Record<TransactionType, { count: number; amount: number }>
  byStatus: Record<TransactionStatus, { count: number; amount: number }>
}

export interface TransactionFilters {
  search?: string
  type?: TransactionType
  status?: TransactionStatus
  paymentMethod?: PaymentMethodType
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}
