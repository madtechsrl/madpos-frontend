"use client"


import { useState } from "react"
import { CartItem } from "../../components/ventas/cart-item"
import { CartSummary } from "../../components/ventas/cart-summary"
import { CartDiscountControls } from "../../components/ventas/cart-discount-controls"
import { PaymentMethods } from "../../components/pagos/payment-methods"
import { ClientSelector } from "../../components/clientes/client-selector"
import { useCart } from "../../contexts/cart-context"
import { useUser } from "../../contexts/user-context"
import { useCartCalculations } from "../../hooks/useCartCalculation"
import { formatCurrency } from "../../lib/utils"
import type { Client } from "../../types/Client"

const CART_WIDTH = "350px"

export function CartSidebar() {
  const { state, clearCart, setClient } = useCart()
  const { customerName, setCustomerName } = useUser()
  const [isCartOpen, setIsCartOpen] = useState(true)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [discountInput, setDiscountInput] = useState("0")
  const [applyTax, setApplyTax] = useState(false)

  // Calculate cart totals
  const discountRate = Number(discountInput) || 0
  const { subtotal, discountAmount, taxAmount, total } = useCartCalculations({
    items: state.items,
    discountRate,
    applyTax,
  })

  // Handle client selection
  const handleClientSelect = (client: Client | null) => {
    setClient(client)
    if (client) {
      setCustomerName(client.firstName)
    } else {
      setCustomerName("Cliente General")
    }
    setShowClientModal(false)
  }

  const handleClearClient = () => {
    setClient(null)
    setCustomerName("Cliente General")
  }

  // Handle checkout process
  const processCheckout = () => {
    if (state.items.length === 0) return
    setShowPaymentOptions(true)
  }

  const handlePaymentComplete = (method: string) => {
    setPaymentMethod(method)
    setPaymentComplete(true)

    // TODO: Record the payment in the system
    // addPaymentRecord(method, total, state.selectedClient)

    // Reset after 3 seconds
    setTimeout(() => {
      clearCart()
      setPaymentComplete(false)
      setShowPaymentOptions(false)
      setPaymentMethod(null)
      setDiscountInput("0")
      setApplyTax(false)
    }, 3000)
  }

  const handleBackToCart = () => {
    setShowPaymentOptions(false)
  }

  return (
    <>
      <div className="bg-white border-start d-flex flex-column" style={{ width: CART_WIDTH }}>
        {/* Header */}
        <div className="p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small fw-medium">{state.selectedClient ? state.selectedClient.firstName : customerName}</div>
            <button className="btn btn-sm text-secondary border-0 p-0" onClick={() => setIsCartOpen(!isCartOpen)}>
              {isCartOpen ? <i className="fas fa-times"></i> : <i className="fas fa-shopping-cart"></i>}
            </button>
          </div>

          {/* Client Selection Buttons */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setShowClientModal(true)}
            >
              <i className="fas fa-user"></i>
              {state.selectedClient ? "Cambiar" : "Seleccionar"}
            </button>

            {state.selectedClient && (
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                onClick={handleClearClient}
                title="Quitar cliente"
              >
                <i className="fas fa-user-times"></i>
              </button>
            )}
          </div>

          {/* Client Info Display */}
          {state.selectedClient && (
            <div className="mt-2 p-2 bg-light rounded small">
              <div className="text fw-bold " style={{}}>Nombre: {state.selectedClient.firstName} {state.selectedClient.lastName}</div>
              <div className="text-muted">Tel: {state.selectedClient.phone}</div>
              <div className="fas fa-file-invoice me-1" style={{}}>RNC: {state.selectedClient.fiscalCode}</div>
              
              {state.selectedClient.currentBalance > 0 && (
                <div className="text-warning">Balance: {formatCurrency(state.selectedClient.currentBalance)}</div>
              )}
            </div>
          )}
        </div>

        {/* Cart Content */}
        {isCartOpen && (
          <>
            {paymentComplete ? (
              // Payment Success Screen
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                <div className="bg-success rounded-circle p-4 mb-3 text-white">
                  <i className="fas fa-check fa-3x"></i>
                </div>
                <h3 className="fw-medium fs-4 mb-1">¡Pago completado!</h3>
                <p className="text-secondary">
                  Pago de {formatCurrency(total)} procesado con {paymentMethod}.
                </p>
                {state.selectedClient && <p className="text-muted small">Cliente: {state.selectedClient.firstName}</p>}
              </div>
            ) : state.items.length > 0 ? (
              // Cart with Items
              <div className="flex-grow-1 overflow-auto">
                {showPaymentOptions ? (
                  // Payment Options Screen
                  <div className="p-3">
                    <div className="mb-3">
                      <h5 className="mb-2">Resumen de Pago</h5>
                      <div className="card bg-light">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small">Subtotal:</span>
                            <span className="small">{formatCurrency(subtotal)}</span>
                          </div>
                          {discountAmount > 0 && (
                            <div className="d-flex justify-content-between mb-1 text-success">
                              <span className="small">Descuento:</span>
                              <span className="small">-{formatCurrency(discountAmount)}</span>
                            </div>
                          )}
                          {applyTax && (
                            <div className="d-flex justify-content-between mb-1">
                              <span className="small">ITBIS:</span>
                              <span className="small">{formatCurrency(taxAmount)}</span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between pt-2 border-top mt-2">
                            <span className="fw-bold">Total:</span>
                            <span className="fw-bold">{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <PaymentMethods total={total} onPaymentComplete={handlePaymentComplete} />

                    <button className="btn btn-outline-secondary w-100 mt-3" onClick={handleBackToCart}>
                      <i className="fas fa-arrow-left me-2"></i>
                      Volver al carrito
                    </button>
                  </div>
                ) : (
                  // Cart Items List
                  <>
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <span className="fw-medium">Productos ({state.items.length})</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => clearCart()}
                        title="Limpiar carrito"
                      >
                        <i className="fas fa-trash-alt me-1"></i>
                        Limpiar
                      </button>
                    </div>

                    <div className="p-3">
                      {state.items.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>

                    {/* Discount and Tax Controls */}
                    <CartDiscountControls
                      discountInput={discountInput}
                      onDiscountChange={setDiscountInput}
                      applyTax={applyTax}
                      onTaxChange={setApplyTax}
                    />

                    {/* Cart Summary */}
                    <CartSummary
                      subtotal={subtotal}
                      discountAmount={discountAmount}
                      discountRate={discountRate}
                      taxAmount={taxAmount}
                      total={total}
                      applyTax={applyTax}
                    />
                  </>
                )}
              </div>
            ) : (
              // Empty Cart
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                <div className="bg-light rounded-circle p-4 mb-3">
                  <i className="fas fa-shopping-cart fa-2x text-secondary"></i>
                </div>
                <h3 className="fw-medium fs-5 mb-1">Tu carrito está vacío</h3>
                <p className="text-secondary small">Haz clic en los productos para añadirlos a la venta</p>
              </div>
            )}
          </>
        )}

        {/* Checkout Button */}
        <div className="p-3 border-top">
          <button
            className={`btn w-100 d-flex align-items-center justify-content-between ${
              state.items.length > 0 && !showPaymentOptions && !paymentComplete
                ? "btn-success"
                : "btn-secondary opacity-50"
            }`}
            onClick={processCheckout}
            disabled={state.items.length === 0 || showPaymentOptions || paymentComplete}
          >
            <span>Ir al pago</span>
            <span className="d-flex align-items-center gap-2">
              {state.items.length > 0 && <span className="badge bg-white text-success">{state.items.length}</span>}
              <i className="fas fa-chevron-right"></i>
            </span>
          </button>
        </div>
      </div>

      {/* Client Selection Modal */}
      {showClientModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Cliente</h5>
                <button type="button" className="btn-close" onClick={() => setShowClientModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <ClientSelector
                  selectedClient={state.selectedClient}
                  onClientSelect={handleClientSelect}
                  onNewClient={() => {
                    setShowClientModal(false)
                    // TODO: Open new client modal
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
