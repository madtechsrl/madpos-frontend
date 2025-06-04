"use client"

import { useState, useEffect } from "react"
import { transactionsApi } from "../lib/mock-api-transaciones"
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

      const [transactionsData, summaryData] = await Promise.all([
        transactionsApi.getTransactions(newFilters),
        transactionsApi.getTransactionSummary(newFilters),
      ])

      setTransactions(transactionsData)
      setSummary(summaryData)
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

  const updateTransactionStatus = async (id: string, status: any) => {
    try {
      const updatedTransaction = await transactionsApi.updateTransactionStatus(id, status)
      setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)))
      return updatedTransaction
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al actualizar transacción")
    }
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
    updateTransactionStatus,
    refetch: fetchTransactions,
  }
}
