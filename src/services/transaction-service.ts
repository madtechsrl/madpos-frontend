import api from "../lib/api"
import type {
  Transaction,
  TransactionFilters,
  TransactionSummary,
} from "../types/transacion"

export async function fetchTransactions(filters: TransactionFilters): Promise<{
  records: Transaction[]
  summary: TransactionSummary
}> {
  const response = await api.get("/v1/transactions", {
    params: {
      search: filters.search || undefined,
      status: filters.status && filters.status !== "all" ? filters.status : undefined,
      paymentMethod:
        filters.paymentMethod && filters.paymentMethod !== "all"
          ? filters.paymentMethod
          : undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    },
  })
  return response.data.data
}
