"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type Product = {
  id: string
  name: string
  price: number
  image?: string
}

type PaymentRecord = {
  id: string
  date: string
  total: number
  method: string
  items: CartItem[]
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, newQuantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  recentPayments: PaymentRecord[]
  addPaymentRecord: (method: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(true)
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([])

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Add payment record
  const addPaymentRecord = (method: string) => {
    if (cart.length === 0) return

    const newPayment: PaymentRecord = {
      id: `payment-${Date.now()}`,
      date: new Date().toISOString(),
      total: cartTotal,
      method,
      items: [...cart],
    }

    setRecentPayments((prev) => [newPayment, ...prev].slice(0, 10)) // Keep only the 10 most recent payments
  }

  // Load cart and payments from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedPayments = localStorage.getItem("recentPayments")

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }

    if (savedPayments) {
      try {
        setRecentPayments(JSON.parse(savedPayments))
      } catch (error) {
        console.error("Failed to parse payments from localStorage:", error)
      }
    }
  }, [])

  // Save cart and payments to localStorage when they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("recentPayments", JSON.stringify(recentPayments))
  }, [recentPayments])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        recentPayments,
        addPaymentRecord,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
