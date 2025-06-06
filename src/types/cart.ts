export interface CartItem {
    id: string
    product: {
      id: string
      name: string
      price: number
      image?: string
    }
    quantity: number
    unitPrice: number
    total: number
  }
  
  export interface Cart {
    items: CartItem[]
    subtotal: number
    tax: number
    discount: number
    total: number
    customerId?: string
    customerName?: string
  }
  
  export type PaymentMethod = "efectivo" | "debito" | "credito" | "otros" | "saldo_cliente" | "credito_fiado"
  
  export interface PaymentMethodOption {
    id: PaymentMethod
    name: string
    icon: string
  }
  