"use client"

import { useState } from "react"
import { CartItem } from "../productos/cart-item"
import { PaymentMethods } from "../pagos/payment-methods"
import { useCart } from "../../contexts/cart-context"
import { useUser } from "../../contexts/user-context"
import { formatCurrency } from "../../lib/utils"

export function CartSidebar() {
  const { cart, clearCart, cartTotal, isCartOpen, setIsCartOpen, addPaymentRecord } = useCart()
  const { customerName } = useUser()
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

  // Process checkout
  const processCheckout = () => {
    if (cart.length === 0) return
    setShowPaymentOptions(true)
  }

  const handlePaymentComplete = (method: string) => {
    setPaymentMethod(method)
    setPaymentComplete(true)

    // Record the payment
    addPaymentRecord(method)

    // Reset after 3 seconds
    setTimeout(() => {
      clearCart()
      setPaymentComplete(false)
      setShowPaymentOptions(false)
      setPaymentMethod(null)
    }, 3000)
  }

  return (
    <div className="bg-white border-start d-flex flex-column" style={{ width: "350px" }}>
      <div className="p-2 border-bottom d-flex justify-content-between align-items-center" style={{width:"250px"}}>
        <div className="small fw-medium">{customerName}</div>
        <button className="btn btn-sm text-secondary border-0" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? <i className="fas fa-times"></i> : <i className="fas fa-shopping-cart"></i>}
        </button>
      </div>

      {isCartOpen && (
        <>
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
          disabled={cart.length === 0 || showPaymentOptions || paymentComplete}
        >
          <span>Ir al pago</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}
