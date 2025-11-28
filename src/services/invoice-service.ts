import type { Invoice, InvoiceItem, StoreConfiguration } from "../types/invoice"
import type { Client } from "../types/Client"
import type { CartItem } from "../contexts/cart-context"

// Generate invoice number
export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `INV-${year}${month}${day}-${random}`
}

// Convert cart items to invoice items
export function cartItemsToInvoiceItems(cartItems: CartItem[]): InvoiceItem[] {
  return cartItems.map((item) => ({
    id: item.id,
    productId: item.id,
    productCode: item.id, // Use product ID as code for now
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    total: item.price * item.quantity,
  }))
}

// Create invoice from cart
export function createInvoice(params: {
  cartItems: CartItem[]
  client: Client | null
  subtotal: number
  discountRate: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
  paymentMethod: string
  amountPaid: number
  cashierName: string
  cashierId: string
  notes?: string
  storeConfig: StoreConfiguration
}): Invoice {
  const now = new Date().toISOString()

  return {
    id: `invoice_${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    date: now,
    // Store info
    storeName: params.storeConfig.name,
    storeLogo: params.storeConfig.logo,
    storePhone: params.storeConfig.phone,
    storeWhatsApp: params.storeConfig.whatsapp,
    storeAddress: params.storeConfig.address,
    storeEmail: params.storeConfig.email,
    // Client info
    clientId: params.client?.id,
    clientName: params.client?.firstName || "Cliente General",
    clientPhone: params.client?.phone,
    clientAddress: params.client?.address,
    clientEmail: params.client?.email,
    clientTaxId: params.client?.taxId,
    // Items
    items: cartItemsToInvoiceItems(params.cartItems),
    // Amounts
    subtotal: params.subtotal,
    discountRate: params.discountRate,
    discountAmount: params.discountAmount,
    taxRate: params.taxRate,
    taxAmount: params.taxAmount,
    total: params.total,
    // Payment
    paymentMethod: params.paymentMethod,
    amountPaid: params.amountPaid,
    change: params.amountPaid - params.total,
    // Additional
    notes: params.notes,
    cashierName: params.cashierName,
    cashierId: params.cashierId,
    // Status
    status: "paid",
    // Timestamps
    createdAt: now,
    updatedAt: now,
  }
}

// Mock store configuration
let storeConfig: StoreConfiguration = {
  name: "MADTECH",
  phone: "+1 (809) 555-1234",
  whatsapp: "+1 (809) 555-1234",
  address: "Calle Principal #123, Santo Domingo",
  email: "info@madtech.com",
  taxId: "RNC: 123-456789-0",
  showClientData: true,
  showProductCode: true,
  headerText: "¡Gracias por su compra!",
  footerText: "Este documento no tiene validez fiscal",
  currency: "DOP",
  taxName: "ITBIS",
  taxRate: 0.18,
}

// Store configuration CRUD
export async function getStoreConfiguration(): Promise<StoreConfiguration> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return { ...storeConfig }
}

export async function updateStoreConfiguration(updates: Partial<StoreConfiguration>): Promise<StoreConfiguration> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  storeConfig = { ...storeConfig, ...updates }
  console.log("Store configuration updated:", storeConfig)
  return { ...storeConfig }
}

// Mock invoice storage
const invoices: Invoice[] = []

// Save invoice
export async function saveInvoice(invoice: Invoice): Promise<Invoice> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  invoices.push(invoice)
  console.log("Invoice saved:", invoice)
  return invoice
}

// Get all invoices
export async function getInvoices(): Promise<Invoice[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return [...invoices]
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return invoices.find((inv) => inv.id === id) || null
}

// Get invoices by date range
export async function getInvoicesByDateRange(startDate: string, endDate: string): Promise<Invoice[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return invoices.filter((inv) => inv.date >= startDate && inv.date <= endDate)
}
