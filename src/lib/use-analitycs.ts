"use client"

import { useState, useEffect } from "react"
import { analyticsApi } from "../lib/mock-analytics-api"
import type {
  AnalyticsPeriod,
  TopProduct,
  TopCustomer,
  TopSeller,
  HourlySales,
  SaleRecord,
  SalesHistoryFilters,
} from "../types/analytics"

export function useAnalytics(userId?: string) {
  const [analytics, setAnalytics] = useState<AnalyticsPeriod | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [topSellers, setTopSellers] = useState<TopSeller[]>([])
  const [hourlySales, setHourlySales] = useState<HourlySales[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (date: Date = new Date(), filterUserId?: string) => {
    try {
      setLoading(true)
      setError(null)

      const [analyticsData, productsData, customersData, sellersData, hourlyData] = await Promise.all([
        analyticsApi.getAnalytics(date, filterUserId),
        analyticsApi.getTopProducts(5, filterUserId),
        analyticsApi.getTopCustomers(5, filterUserId),
        analyticsApi.getTopSellers(),
        analyticsApi.getHourlySales(date, filterUserId),
      ])

      setAnalytics(analyticsData)
      setTopProducts(productsData)
      setTopCustomers(customersData)
      setTopSellers(sellersData)
      setHourlySales(hourlyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(new Date(), userId)
  }, [userId])

  return {
    analytics,
    topProducts,
    topCustomers,
    topSellers,
    hourlySales,
    loading,
    error,
    refetch: (date?: Date) => fetchAnalytics(date, userId),
  }
}

export function useSalesHistory(userId?: string) {
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalesHistory = async (filters: SalesHistoryFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      // Add userId to filters if provided
      const finalFilters = userId ? { ...filters, sellerId: userId } : filters

      const data = await analyticsApi.getSalesHistory(finalFilters)
      setSalesHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar historial de ventas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesHistory()
  }, [userId])

  return {
    salesHistory,
    loading,
    error,
    fetchSalesHistory,
  }
}
