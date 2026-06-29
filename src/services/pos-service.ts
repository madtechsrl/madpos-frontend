import api from "../lib/api"

export type CashSession = {
  id: string
  openedAt: string
  openingAmount: number
  expectedOpeningAmount: number
  openingDifference: number
  openingStatus: "BALANCED" | "DIFFERENCE"
  openingBreakdown?: CashOpeningBreakdownLine[]
  status: "OPEN" | "CLOSED"
}

export type CashOpeningBreakdownLine = {
  denomination: number
  quantity: number
  amount?: number
}

export async function getCurrentCashSession(): Promise<CashSession | null> {
  const response = await api.get("/v1/cash-sessions/current")
  return response.data.data
}

export async function openCashSession(payload: {
  openingAmount: number
  expectedOpeningAmount: number
  breakdown: CashOpeningBreakdownLine[]
}): Promise<CashSession> {
  const response = await api.post("/v1/cash-sessions/open", payload)
  return response.data.data
}

export async function closeCashSession(closingAmount: number) {
  const response = await api.post("/v1/cash-sessions/close", { closingAmount })
  return response.data.data
}

export async function checkout(payload: {
  warehouseId: string
  customerId?: string | null
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "OTHER"
  paymentIntentId: string
  items: { packagingId: string; quantity: number }[]
}) {
  const response = await api.post("/v1/pos/checkout", payload)
  return response.data.data
}
