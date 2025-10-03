"use client"

import { useState } from "react"
import { formatCurrency } from "../../lib/utils"

interface PaymentMethodsProps {
  total: number
  onPaymentComplete: (method: string) => void
}

export function PaymentMethods({ total, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amountReceived, setAmountReceived] = useState("")
  const [processing, setProcessing] = useState(false)

  const paymentMethods = [
    { id: "cash", name: "Efectivo", icon: "fas fa-money-bill-wave", color: "success" },
    { id: "card", name: "Tarjeta", icon: "fas fa-credit-card", color: "primary" },
    { id: "transfer", name: "Transferencia", icon: "fas fa-exchange-alt", color: "info" },
    { id: "credit", name: "Crédito", icon: "fas fa-file-invoice-dollar", color: "warning" },
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    if (methodId === "cash") {
      setAmountReceived("")
    }
  }

  const handleConfirmPayment = () => {
    if (!selectedMethod) return

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const method = paymentMethods.find((m) => m.id === selectedMethod)
      onPaymentComplete(method?.name || selectedMethod)
      setProcessing(false)
    }, 1000)
  }

  const receivedAmount = Number(amountReceived) || 0
  const change = receivedAmount - total

  const canConfirm = selectedMethod && (selectedMethod !== "cash" || (receivedAmount > 0 && receivedAmount >= total))

  return (
    <div>
      <h6 className="mb-3">Selecciona el método de pago</h6>

      {/* Payment Method Buttons */}
      <div className="row g-2 mb-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="col-6">
            <button
              className={`btn w-100 ${
                selectedMethod === method.id ? `btn-${method.color}` : `btn-outline-${method.color}`
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <i className={`${method.icon} me-2`}></i>
              {method.name}
            </button>
          </div>
        ))}
      </div>

      {/* Cash Payment Details */}
      {selectedMethod === "cash" && (
        <div className="card bg-light mb-3">
          <div className="card-body">
            <label htmlFor="amount-received" className="form-label small mb-1">
              Monto recibido
            </label>
            <input
              id="amount-received"
              type="number"
              className="form-control mb-2"
              placeholder="0.00"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              min={total}
              step="0.01"
            />

            {receivedAmount > 0 && (
              <div className="d-flex justify-content-between">
                <span className="small">Cambio:</span>
                <span className={`fw-bold ${change >= 0 ? "text-success" : "text-danger"}`}>
                  {formatCurrency(Math.max(0, change))}
                </span>
              </div>
            )}

            {receivedAmount > 0 && receivedAmount < total && (
              <div className="alert alert-warning small mt-2 mb-0">El monto recibido es menor que el total</div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        className={`btn w-100 ${canConfirm ? "btn-success" : "btn-secondary"}`}
        onClick={handleConfirmPayment}
        disabled={!canConfirm || processing}
      >
        {processing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Procesando...
          </>
        ) : (
          <>
            <i className="fas fa-check me-2"></i>
            Confirmar Pago - {formatCurrency(total)}
          </>
        )}
      </button>
    </div>
  )
}
