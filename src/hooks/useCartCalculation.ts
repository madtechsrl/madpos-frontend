import { useMemo } from "react"
import type { CartItem } from "../contexts/cart-context"

interface CartCalculations {
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

interface UseCartCalculationsProps {
  items: CartItem[]
  discountRate: number // 0-100
  applyTax: boolean
  taxRate?: number
}

export function useCartCalculations({
  items,
  discountRate,
  applyTax,
  taxRate = 0.18, // 18% ITBIS
}: UseCartCalculationsProps): CartCalculations {
  return useMemo(() => {
    // Calculate subtotal
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    // Validate and normalize discount rate
    const normalizedDiscountRate = Math.min(Math.max(discountRate, 0), 100) / 100

    // Calculate discount amount
    const discountAmount = subtotal * normalizedDiscountRate

    // Calculate tax amount (applied after discount)
    const taxableAmount = subtotal - discountAmount
    const taxAmount = applyTax ? taxableAmount * taxRate : 0

    // Calculate final total
    const total = subtotal - discountAmount + taxAmount

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    }
  }, [items, discountRate, applyTax, taxRate])
}
