
import type { ReactNode } from "react"
import { CartProvider } from "./cart-context"
import { ProductProvider } from "./product-context"

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ProductProvider>
      <CartProvider>{children}</CartProvider>
    </ProductProvider>
  )
}
