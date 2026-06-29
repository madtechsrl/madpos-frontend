import { useState } from "react"
import { useTransactions } from "../../lib/use-transacion"
import {  type Transaction } from "../../types/transacion"
import { TransactionFiltersComponent } from "./transaction-filters"
import { TransactionSummaryComponent } from "./transaction-summary"


export default function TransactionsPage() {
  const { transactions, summary, loading, error, filters, updateFilters, refetch } = useTransactions()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-DO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sale: "Venta",
      return: "Devolución",
      refund: "Reembolso",
      adjustment: "Ajuste",
      payment: "Pago",
    }
    return labels[type] || type
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
    const labels: Record<string, string> = {
      completed: "Completado",
      pending: "Pendiente",
      failed: "Fallido",
      cancelled: "Cancelado",
    }
    return labels[status] || status
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <i className="fas fa-money-bill-wave me-1" />
      case "card":
        return <i className="fas fa-credit-card me-1" />
      default:
        return <i className="fas fa-exchange-alt me-1" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      check: "Cheque",
      credit: "Crédito",
    }
    return labels[method] || method
  }

  const handleClearFilters = () => updateFilters({})

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Cargando transacciones...</p>
      </div>
    )
  }

  return (
      <div className="container-fluid py-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Gestión de Transacciones</h2>
            <p className="text-muted">Monitorea y gestiona todas las transacciones del sistema</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => void refetch()}>
              <i className="fas fa-sync-alt me-1" />
              Actualizar
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {summary && <TransactionSummaryComponent summary={summary} />}

        <TransactionFiltersComponent
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="card mt-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Referencia</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Método de Pago</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.reference}</td>
                      <td>{formatDate(new Date(transaction.createdAt))}</td>
                      <td>
                        <span className="badge bg-light text-dark">{getTypeLabel(transaction.type)}</span>
                      </td>
                      <td>{transaction.customerName || "-"}</td>
                      <td>
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        {getPaymentMethodLabel(transaction.paymentMethod)}
                      </td>
                      <td className={transaction.amount < 0 ? "text-danger" : "text-success"}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>
                      <td>{transaction.userName}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <i className="fas fa-eye me-1" />
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <p>No se encontraron transacciones que coincidan con los filtros aplicados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedTransaction && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <div>
                    <h5 className="modal-title">{selectedTransaction.reference}</h5>
                    <div className="small text-muted">
                      {formatDate(new Date(selectedTransaction.createdAt))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedTransaction(null)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="text-muted small">Cliente</div>
                      <strong>{selectedTransaction.customerName}</strong>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small">Cajero</div>
                      <strong>{selectedTransaction.userName}</strong>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small">Almacén</div>
                      <strong>{selectedTransaction.warehouseName || "—"}</strong>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Presentación</th>
                          <th className="text-end">Cantidad</th>
                          <th className="text-end">Precio</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTransaction.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.productName}</td>
                            <td>{item.packagingName}</td>
                            <td className="text-end">{item.quantity}</td>
                            <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-end">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={4} className="text-end">Total vendido</th>
                          <th className="text-end">{formatCurrency(selectedTransaction.amount)}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedTransaction(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}
