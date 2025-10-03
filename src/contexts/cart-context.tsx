import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Client } from "../types/Client"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// type Product = {
//   id: string
//   name: string
//   price: number
//   image?: string
// }

// type PaymentRecord = {
//   id: string
//   date: string
//   total: number
//   method: string
//   items: CartItem[]
// }

interface CartState {
  items: CartItem[]
  total: number
  selectedClient: Client | null
  paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia" | "Crédito"
  discount: number
  tax: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CLIENT"; payload: Client | null }
  | { type: "SET_PAYMENT_METHOD"; payload: CartState["paymentMethod"] }
  | { type: "SET_DISCOUNT"; payload: number }
  | { type: "SET_TAX"; payload: number }

const initialState: CartState = {
  items: [],
  total: 0,
  selectedClient: null,
  paymentMethod: "Efectivo",
  discount: 0,
  tax: 0,
}
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - state.discount + state.tax

      return { ...state, items: newItems, total }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - state.discount + state.tax

      return { ...state, items: newItems, total }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - state.discount + state.tax

      return { ...state, items: newItems, total }
    }

    case "CLEAR_CART":
      return { ...initialState, selectedClient: state.selectedClient }

    case "SET_CLIENT":
      return { ...state, selectedClient: action.payload }

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload }

    case "SET_DISCOUNT": {
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - action.payload + state.tax
      return { ...state, discount: action.payload, total }
    }

    case "SET_TAX": {
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - state.discount + action.payload
      return { ...state, tax: action.payload, total }
    }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setClient: (client: Client | null) => void
  setPaymentMethod: (method: CartState["paymentMethod"]) => void
  setDiscount: (discount: number) => void
  setTax: (tax: number) => void
  // Legacy support
  items: CartItem[]
  total: number
  selectedClient: Client | null

} | null>(null)



export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const setClient = (client: Client | null) => {
    dispatch({ type: "SET_CLIENT", payload: client })
  }

  const setPaymentMethod = (method: CartState["paymentMethod"]) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method })
  }

  const setDiscount = (discount: number) => {
    dispatch({ type: "SET_DISCOUNT", payload: discount })
  }

  const setTax = (tax: number) => {
    dispatch({ type: "SET_TAX", payload: tax })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setClient,
        setPaymentMethod,
        setDiscount,
        setTax,
        // Legacy support
        items: state.items,
        total: state.total,
        selectedClient: state.selectedClient,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
