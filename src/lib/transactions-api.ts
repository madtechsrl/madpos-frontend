import { fetchTransactions } from "../services/transaction-service"
import type { TransactionFilters } from "../types/transacion"

export const transactionsApi = {
  async getTransactions(filters: TransactionFilters = {}) {
    const data = await fetchTransactions(filters)
    return data.records
  },
}
