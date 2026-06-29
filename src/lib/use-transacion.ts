"use client"

import { useState, useEffect } from "react"
import { fetchTransactions as fetchTransactionsApi } from "../services/transaction-service"
import type { Transaction, TransactionSummary, TransactionFilters } from "../types/transacion"

export function useTransactions(initialFilters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)

  const fetchTransactions = async (newFilters: TransactionFilters = filters) => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchTransactionsApi(newFilters)
      setTransactions(data.records)
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar transacciones")
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters)
    fetchTransactions(newFilters)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    summary,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchTransactions,
  }
}
