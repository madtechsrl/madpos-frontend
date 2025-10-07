// src/hooks/useProducts.ts
import { useContext } from "react"
import {ProductContext } from "../contexts/product-context"

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
