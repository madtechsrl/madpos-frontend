"use client"

import { useEffect, useState } from "react"
import { CartItem } from "../productos/cart-item"
import { PaymentMethods } from "../pagos/payment-methods"
import { useCart } from "../../contexts/cart-context"
import { formatCurrency } from "../../lib/utils"
import { checkout, closeCashSession, getCurrentCashSession, openCashSession } from "../../services/pos-service"
import type { CashSession } from "../../services/pos-service"
import { fetchCustomers } from "../../services/customer-service"
import type { Customer } from "../../services/customer-service"

const CASH_DENOMINATIONS = [2000, 1000, 500, 200, 100, 50, 25, 10, 5, 1]
const DEFAULT_OPENING_FUND = Number(import.meta.env.VITE_DEFAULT_CASH_FUND || 2000)

export function CartSidebar() {
  const { cart, clearCart, cartTotal, isCartOpen, setIsCartOpen, addPaymentRecord } = useCart()
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [session, setSession] = useState<CashSession | null>(null)
  const [expectedOpeningAmount, setExpectedOpeningAmount] = useState(DEFAULT_OPENING_FUND)
  const [openingCounts, setOpeningCounts] = useState<Record<number, number>>({})
  const [closingAmount, setClosingAmount] = useState(0)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState("")
  const [error, setError] = useState("")
  const openingBreakdown = CASH_DENOMINATIONS.map((denomination) => ({
    denomination,
    quantity: openingCounts[denomination] || 0,
  })).filter((line) => line.quantity > 0)
  const openingAmount = openingBreakdown.reduce((total, line) => total + line.denomination * line.quantity, 0)
  const openingDifference = openingAmount - expectedOpeningAmount

  useEffect(() => {
    void Promise.all([getCurrentCashSession(), fetchCustomers()])
      .then(([cashSession, customerRecords]) => {
        setSession(cashSession)
        setCustomers(customerRecords.filter((customer) => customer.isActive))
      })
      .catch(() => setError("No fue posible consultar la caja o los clientes."))
  }, [])

  // Process checkout
  const processCheckout = () => {
    if (cart.length === 0) return
    setShowPaymentOptions(true)
  }

  const handlePaymentComplete = async (method: string) => {
    try {
      setError("")
      const methodMap: Record<string, "CASH" | "CARD" | "TRANSFER" | "OTHER"> = {
        efectivo: "CASH",
        debito: "CARD",
        credito: "CARD",
        otros: "OTHER",
      }
      await checkout({
        warehouseId: cart[0].warehouseId,
        customerId: customerId || null,
        paymentMethod: methodMap[method] || "OTHER",
        paymentIntentId: crypto.randomUUID(),
        items: cart.map((item) => ({ packagingId: item.packagingId, quantity: item.quantity })),
      })
      setPaymentMethod(method)
      setPaymentComplete(true)
      addPaymentRecord(method)
      setTimeout(() => {
        clearCart()
        setPaymentComplete(false)
        setShowPaymentOptions(false)
        setPaymentMethod(null)
      }, 2500)
    } catch (paymentError: any) {
      setError(paymentError?.response?.data?.message || "No fue posible completar la venta.")
      throw paymentError
    }
  }

  return (
    <div className="bg-white border-start d-flex flex-column" style={{ width: "350px" }}>
      <div className="p-2 border-bottom d-flex justify-content-between align-items-center" style={{width:"250px"}}>
        <div className="small fw-medium">{session ? "Caja abierta" : "Caja cerrada"}</div>
        <button className="btn btn-sm text-secondary border-0" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? <i className="fas fa-times"></i> : <i className="fas fa-shopping-cart"></i>}
        </button>
      </div>

      {isCartOpen && (
        <>
          <div className="p-3 border-bottom" style={{ width: "100%" }}>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {!session ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium small">Arqueo de fondo</span>
                  <span className={`badge ${openingDifference === 0 ? "text-bg-success" : "text-bg-warning"}`}>
                    {openingDifference === 0 ? "Cuadrado" : "Diferencia"}
                  </span>
                </div>
                <label className="form-label small">Fondo esperado</label>
                <input
                  className="form-control form-control-sm mb-2"
                  type="number"
                  min="0"
                  value={expectedOpeningAmount}
                  onChange={(e) => setExpectedOpeningAmount(Number(e.target.value))}
                />
                <div className="border rounded p-2 mb-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {CASH_DENOMINATIONS.map((denomination) => {
                    const quantity = openingCounts[denomination] || 0
                    return (
                      <div className="d-flex align-items-center gap-2 mb-2" key={denomination}>
                        <span className="small text-secondary" style={{ width: "62px" }}>
                          {formatCurrency(denomination)}
                        </span>
                        <input
                          className="form-control form-control-sm"
                          type="number"
                          min="0"
                          step="1"
                          value={quantity || ""}
                          placeholder="0"
                          onChange={(e) =>
                            setOpeningCounts((current) => ({
                              ...current,
                              [denomination]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                        />
                        <span className="small fw-medium text-end" style={{ width: "72px" }}>
                          {formatCurrency(quantity * denomination)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="small mb-2">
                  <div className="d-flex justify-content-between">
                    <span>Contado</span>
                    <strong>{formatCurrency(openingAmount)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Diferencia</span>
                    <strong className={openingDifference === 0 ? "text-success" : "text-danger"}>
                      {formatCurrency(openingDifference)}
                    </strong>
                  </div>
                </div>
                <button
                  className="btn btn-success w-100"
                  disabled={openingAmount <= 0 || openingDifference !== 0}
                  onClick={async () => {
                    try {
                      setSession(await openCashSession({ openingAmount, expectedOpeningAmount, breakdown: openingBreakdown }))
                      setOpeningCounts({})
                      setError("")
                    } catch (openError: any) {
                      setError(openError?.response?.data?.message || "No fue posible abrir la caja.")
                    }
                  }}
                >
                  Abrir caja
                </button>
              </div>
            ) : (
              <div>
                <select className="form-select form-select-sm mb-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  <option value="">Consumidor final</option>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </select>
                <div className="input-group input-group-sm">
                  <input className="form-control" type="number" min="0" placeholder="Efectivo contado" value={closingAmount || ""} onChange={(e) => setClosingAmount(Number(e.target.value))} />
                  <button className="btn btn-outline-danger" disabled={cart.length > 0} onClick={async () => {
                    try { await closeCashSession(closingAmount); setSession(null); setError("") } catch { setError("No fue posible cerrar la caja.") }
                  }}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
          {paymentComplete ? (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
              <div className="bg-success rounded-circle p-4 mb-3 text-white">
                <i className="fas fa-check fa-3x"></i>
              </div>
              <h3 className="fw-medium fs-4 mb-1">¡Pago completado!</h3>
              <p className="text-secondary">
                Pago de {formatCurrency(cartTotal)} procesado con {paymentMethod}.
              </p>
            </div>
          ) : cart.length > 0 ? (
            <div className="flex-grow-1 overflow-auto" style={{width:"250px"}}>
              {showPaymentOptions ? (
                <div className="p-3">
                  <PaymentMethods total={cartTotal} onPaymentComplete={handlePaymentComplete} />
                  <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => setShowPaymentOptions(false)}>
                    <i className="fas fa-arrow-left me-2"></i>Volver al carrito
                  </button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <span className="fw-medium">Productos ({cart.length})</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => clearCart()}
                      title="Limpiar carrito"
                    >
                      <i className="fas fa-trash-alt me-1"></i> Limpiar todo
                    </button>
                  </div>
                  <div className="p-2">
                    {cart.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                  <div className="border-top p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Subtotal:</span>
                      <span className="fw-medium">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-secondary">Total:</span>
                      <span className="fw-bold fs-5">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
              <div className="bg-light rounded-circle p-4 mb-3">
                <i className="fas fa-shopping-cart fa-2x text-secondary"></i>
              </div>
              <h3 className="fw-medium fs-5 mb-1">Tu carrito está vacío.</h3>
              <p className="text-secondary small">Clica en los artículos para añadirlos a la venta.</p>
            </div>
          )}
        </>
      )}

      <div className="p-3 border-top">
        <button
          className={`btn w-100 d-flex align-items-center justify-content-between ${
            cart.length > 0 && !showPaymentOptions && !paymentComplete ? "btn-success" : "btn-secondary opacity-50"
          }`}
          onClick={processCheckout}
          disabled={!session || cart.length === 0 || showPaymentOptions || paymentComplete}
        >
          <span>Ir al pago</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}
