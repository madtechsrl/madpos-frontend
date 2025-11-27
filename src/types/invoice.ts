// Type definition with comments
export interface InvoiceItem {
  id: string // Unique item ID
  productId: string // Reference to product
  productCode: string // Product SKU/Code
  productName: string // Product display name
  quantity: number // Quantity purchased
  unitPrice: number // Price per unit
  total: number // quantity * unitPrice
}

export interface Invoice {
  // Basic Info
  id: string // Unique invoice ID
  invoiceNumber: string // Human-readable invoice number (e.g., INV-20231015-1234)
  date: string // ISO 8601 date string

  // Store Information
  storeName: string // Business name
  storeLogo?: string // Logo URL or path (optional)
  storePhone?: string // Contact phone (optional)
  storeWhatsApp?: string // WhatsApp number (optional)
  storeAddress?: string // Physical address (optional)
  storeEmail?: string // Contact email (optional)
  storeTaxId?: string // Tax ID / RNC (optional)

  // Client Information
  clientId?: string // Reference to client record (optional)
  clientName: string // Client name (required, defaults to "Cliente General")
  clientPhone?: string // Client phone (optional)
  clientAddress?: string // Client address (optional)
  clientEmail?: string // Client email (optional)
  clientTaxId?: string // Client tax ID (optional)

  // Items
  items: InvoiceItem[] // Array of purchased items

  // Financial Calculations
  subtotal: number // Sum of all item totals
  discountRate: number // Discount percentage (0-100)
  discountAmount: number // Calculated discount amount
  taxRate: number // Tax rate (e.g., 0.18 for 18%)
  taxAmount: number // Calculated tax amount
  total: number // Final amount: subtotal - discount + tax

  // Payment Details
  paymentMethod: string // "Efectivo", "Tarjeta", "Transferencia", "Crédito"
  amountPaid: number // Amount received from customer
  change: number // Change to return (amountPaid - total)

  // Additional Information
  notes?: string // Optional notes or observations
  cashierName: string // Name of cashier who processed sale
  cashierId: string // ID of cashier

  // Status
  status: "paid" | "pending" | "cancelled" // Invoice status

  // Timestamps
  createdAt: string // ISO 8601 creation timestamp
  updatedAt: string // ISO 8601 last update timestamp
}

export interface StoreConfiguration {
  // Basic Store Info
  name: string // Store name
  logo?: string // Logo URL or path
  phone?: string // Contact phone
  whatsapp?: string // WhatsApp number
  address?: string // Physical address
  email?: string // Contact email
  taxId?: string // Tax ID / RNC

  // Receipt Settings
  showClientData: boolean // Whether to show client info on receipt
  showProductCode: boolean // Whether to show product codes
  headerText?: string // Custom header text
  footerText?: string // Custom footer text
  currency: string // Currency code (e.g., "DOP", "USD")
  taxName: string // Tax name (e.g., "ITBIS", "IVA")
  taxRate: number // Default tax rate
}
