"use client"

import { useState } from "react"
import { formatCurrency } from "../../lib/utils"

type PaymentMethod = {
  id: string
  name: string
  icon: string
  enabled: boolean
  forTPV: boolean
  forCatalog: boolean
}

type PaymentMethodsProps = {
  total: number
  onPaymentComplete: (method: string) => void
}

export function PaymentMethods({ total, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Default payment methods based on your configuration screen
  const paymentMethods: PaymentMethod[] = [
    {
      id: "efectivo",
      name: "Efectivo",
      icon: "fa-money-bill-wave",
      enabled: true,
      forTPV: true,
      forCatalog: true,
    },
    {
      id: "debito",
      name: "Débito",
      icon: "fa-credit-card",
      enabled: true,
      forTPV: true,
      forCatalog: false,
    },
    {
      id: "credito",
      name: "Crédito",
      icon: "fa-credit-card",
      enabled: true,
      forTPV: true,
      forCatalog: false,
    },
    {
      id: "otros",
      name: "Otros",
      icon: "fa-wallet",
      enabled: true,
      forTPV: true,
      forCatalog: false,
    },
    {
      id: "saldo",
      name: "Saldo Cliente",
      icon: "fa-user-tag",
      enabled: true,
      forTPV: true,
      forCatalog: false,
    },
    {
      id: "link",
      name: "Link de Pago",
      icon: "fa-link",
      enabled: true,
      forTPV: false,
      forCatalog: false,
    },
    {
      id: "online",
      name: "Pagos online",
      icon: "fa-globe",
      enabled: true,
      forTPV: false,
      forCatalog: false,
    },
    {
      id: "lector",
      name: "Lector de tarjeta",
      icon: "fa-credit-card",
      enabled: true,
      forTPV: false,
      forCatalog: false,
    },
    {
      id: "fiado",
      name: "Crédito (Fiado)",
      icon: "fa-handshake",
      enabled: true,
      forTPV: true,
      forCatalog: false,
    },
  ]

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId)
    setShowPaymentModal(true)
  }

  const handleProcessPayment = () => {
    if (!selectedMethod) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowPaymentModal(false)
      onPaymentComplete(selectedMethod)
    }, 1500)
  }

  // Add a helper function to get payment method details
  const getPaymentMethodDetails = (methodId: string) => {
    switch (methodId) {
      case "efectivo":
        return {
          title: "Pago en Efectivo",
          description: "El cliente paga con dinero en efectivo.",
          icon: "fa-money-bill-wave",
          color: "text-success",
        }
      case "debito":
        return {
          title: "Pago con Débito",
          description: "El cliente paga con tarjeta de débito.",
          icon: "fa-credit-card",
          color: "text-primary",
        }
      case "credito":
        return {
          title: "Pago con Crédito",
          description: "El cliente paga con tarjeta de crédito.",
          icon: "fa-credit-card",
          color: "text-danger",
        }
      case "fiado":
        return {
          title: "Crédito (Fiado)",
          description: "El cliente pagará en una fecha posterior.",
          icon: "fa-handshake",
          color: "text-info",
        }
      default:
        return {
          title: "Otro método de pago",
          description: "Método de pago alternativo.",
          icon: "fa-wallet",
          color: "text-secondary",
        }
    }
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="fs-5 fw-semibold mb-3">Seleccionar método de pago</h3>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {paymentMethods
            .filter((method) => method.enabled && method.forTPV)
            .map((method) => (
              <div className="col" key={method.id}>
                <button
                  className="btn btn-outline-secondary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                  onClick={() => handleSelectMethod(method.id)}
                >
                  <i className={`fas ${method.icon} fa-2x mb-2`}></i>
                  <span>{method.name}</span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedMethod && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{getPaymentMethodDetails(selectedMethod).title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessing}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <i
                    className={`fas ${getPaymentMethodDetails(selectedMethod).icon} fa-3x mb-3 ${getPaymentMethodDetails(selectedMethod).color}`}
                  ></i>
                  <h4 className="fw-bold">{formatCurrency(total)}</h4>
                  <p className="text-muted">{getPaymentMethodDetails(selectedMethod).description}</p>
                </div>

                {selectedMethod === "efectivo" && (
                  <div className="mb-3">
                    <label htmlFor="cash-received" className="form-label">
                      Monto recibido
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">RD$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="cash-received"
                        placeholder="0.00"
                        defaultValue={Math.ceil(total / 100) * 100}
                      />
                    </div>
                    <div className="form-text text-end">
                      Cambio: {formatCurrency(Math.ceil(total / 100) * 100 - total)}
                    </div>
                  </div>
                )}

                {selectedMethod === "credito" && (
                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="radio" name="card-type" id="visa" defaultChecked />
                      <label className="form-check-label" htmlFor="visa">
                        <i className="fab fa-cc-visa me-2"></i>Visa
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="radio" name="card-type" id="mastercard" />
                      <label className="form-check-label" htmlFor="mastercard">
                        <i className="fab fa-cc-mastercard me-2"></i>Mastercard
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="radio" name="card-type" id="other-card" />
                      <label className="form-check-label" htmlFor="other-card">
                        <i className="fas fa-credit-card me-2"></i>Otra tarjeta
                      </label>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="card-last-digits" className="form-label">
                        Últimos 4 dígitos (opcional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="card-last-digits"
                        maxLength={4}
                        placeholder="0000"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "fiado" && (
                  <div className="mb-3">
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Esta venta quedará registrada como pendiente de pago.
                    </div>
                    <label htmlFor="fiado-date" className="form-label">
                      Fecha de pago estimada
                    </label>
                    <input type="date" className="form-control" id="fiado-date" />
                  </div>
                )}

                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Al completar el pago, se generará un recibo para esta transacción.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>Completar Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
