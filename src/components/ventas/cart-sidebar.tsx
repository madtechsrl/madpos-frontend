"use client"


import { useState } from "react"
import { CartItem } from "../ventas/cart-item"
import { CartSummary } from "../ventas/cart-summary"
import { CartDiscountControls } from "../pagos/cart-discount-methods"
import { PaymentMethods } from "../pagos/payment-methods"
import { ClientSelector } from "../clientes/client-selector"
import { useCart } from "../../contexts/cart-context"
import { useUser } from "../../contexts/user-context"
import { useCartCalculations } from "../../hooks/useCartCalculation"
import { formatCurrency } from "../../lib/utils"
import type { Client } from "../../types/Client"

const TAX_RATE = 0.18

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
  // Process checkout



  const handleClientSelect = (client:Client | null)=>{
    setClient(client)
    if(client){
      setCustomerName(client.name)      
    }else{
      setCustomerName("Cliente General")
    }
    setShowClientModal(false)
  }


  const handleClearClient = ()=>{
        setClient(null)
        setCustomerName("Cliente General");   
  }

    // Handle checkout process
  const processCheckout = () => {
    if (state.items.length === 0) return
    setShowPaymentOptions(true)
  }

  const handlePaymentComplete = (method: string) => {
    setPaymentMethod(method)
    setPaymentComplete(true)

    // Reset after 3 seconds
    setTimeout(() => {
      clearCart()
      setPaymentComplete(false)
      setShowPaymentOptions(false)
      setPaymentMethod(null)
    }, 3000)
  }

  const handleBackToCart = () => {
    setShowPaymentOptions(false)
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
                  <div className="mb-2">
                    <label className="form-check-label small">Descuento(%)</label>
                      
                      <input
                        className="form-control form-control-sm"
                        min={0}
                        max={100}
                        type="number"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                      />
                       <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="applyTax"
                        checked={applyTax}
                        onChange={() => setApplyTax(!applyTax)}
                      />
                      <label className="form-check-label small" htmlFor="applyTax">
                        Aplicar ITBIS (18%)
                      </label>
                    </div>

                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Subtotal:</span>
                      <span className="fw-medium">{formatCurrency(subtotal)}</span>
                    </div>

                     {parseFloat(discountInput) > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span className="text-secondary">Desc ( {discountInput}%):</span>
                        <span className="fw-medium">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )} 

                    {applyTax && (
                      <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">ITBIS (18%):</span>
                      <span className="fw-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                    )}

                    
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-secondary">Total:</span>
                      <span className="fw-bold fs-5">{formatCurrency(total)}</span>
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
              <p className="text-secondary small">Click en los artículos para añadirlos a la venta.</p>
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
