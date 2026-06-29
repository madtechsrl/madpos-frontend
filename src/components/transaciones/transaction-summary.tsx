"use client"

import type { TransactionSummary } from "../../types/transacion"

interface TransactionSummaryProps {
  summary: TransactionSummary
}

export function TransactionSummaryComponent({ summary }: TransactionSummaryProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount)

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <i className="fas fa-money-bill-wave me-2 text-success" />
      case "card":
        return <i className="fas fa-credit-card me-2 text-primary" />
      default:
        return <i className="fas fa-exchange-alt me-2 text-muted" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <i className="fas fa-arrow-up me-2 text-success" />
      case "refund":
      case "return":
        return <i className="fas fa-arrow-down me-2 text-danger" />
      default:
        return <i className="fas fa-dollar-sign me-2 text-info" />
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white"
      case "pending":
        return "bg-secondary text-white"
      case "failed":
        return "bg-danger text-white"
      case "cancelled":
        return "bg-warning text-dark"
      default:
        return "bg-secondary text-white"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="row g-4 mb-4">
      {/* Total Summary */}
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-title text-muted">Total de Transacciones</h6>
            <h4 className="card-text fw-bold">{summary.totalTransactions}</h4>
            <p className="text-muted">{formatCurrency(summary.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* By Payment Method */}
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-title text-muted">Por Método de Pago</h6>
            {Object.entries(summary.byPaymentMethod)
              .filter(([_, data]) => data.count > 0)
              .map(([method, data]) => (
                <div key={method} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    {getPaymentMethodIcon(method)}
                    <span className="text-capitalize">{method === "cash" ? "Efectivo" : method === "card" ? "Tarjeta" : method}</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{data.count}</div>
                    <small className="text-muted">{formatCurrency(data.amount)}</small>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* By Type */}
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-title text-muted">Por Tipo</h6>
            {Object.entries(summary.byType)
              .filter(([_, data]) => data.count > 0)
              .map(([type, data]) => (
                <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    {getTypeIcon(type)}
                    <span className="text-capitalize">
                      {type === "sale" ? "Venta" : type === "refund" ? "Reembolso" : type === "return" ? "Devolución" : type}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{data.count}</div>
                    <small className="text-muted">{formatCurrency(data.amount)}</small>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* By Status */}
      <div className="col-md-6 col-lg-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-title text-muted">Por Estado</h6>
            {Object.entries(summary.byStatus)
              .filter(([_, data]) => data.count > 0)
              .map(([status, data]) => (
                <div key={status} className="d-flex justify-content-between align-items-center mb-2">
                  <span className={`badge ${getStatusBadgeClass(status)} px-2 py-1`}>
                    {getStatusLabel(status)}
                  </span>
                  <div className="text-end">
                    <div className="fw-semibold">{data.count}</div>
                    <small className="text-muted">{formatCurrency(data.amount)}</small>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
