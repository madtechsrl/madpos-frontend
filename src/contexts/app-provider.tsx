
import type { ReactNode } from "react"
import { CartProvider } from "./cart-context"
import { ProductProvider } from "./product-context"
import { UserProvider } from "./user-context"
import { AuthProvider } from "./auth-context"

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>{children}</CartProvider>
        </ProductProvider>
      </UserProvider>
    </AuthProvider>
  )
}
