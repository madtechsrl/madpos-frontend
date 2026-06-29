export type TransactionType = "sale"
export type TransactionStatus = "completed" | "pending" | "cancelled" | "failed"
export type PaymentMethodType = "cash" | "card" | "transfer" | "other"

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
  warehouseName?: string
  items: {
    id: string
    productName: string
    packagingName: string
    quantity: number
    unitPrice: number
    total: number
  }[]
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
  type?: TransactionType | "all"
  status?: TransactionStatus | "all"
  paymentMethod?: PaymentMethodType | "all"
  userId?: string
  dateFrom?: string
  dateTo?: string
}
