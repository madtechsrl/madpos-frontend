import { useState } from "react"
import { Header } from "../layout/header"
import { RoleGuard } from "../analitica/role-guard"
import { useTransactions } from "../../lib/use-transacion"
import { useAuth } from "../../contexts/auth-context"
import {  type Transaction } from "../../types/transacion"
import { TransactionFiltersComponent } from "./transaction-filters"
import { TransactionSummaryComponent } from "./transaction-summary"
import {  type UserRole, type UserRoleId, getRoleById } from "../../types/User"


export default function TransactionsPage() {
  const { user } = useAuth()
  const { transactions, summary, loading, error, filters, updateFilters, updateTransactionStatus } = useTransactions()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const currentUserRole = getRoleById(user?.role as UserRoleId)
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

  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    try {
      await updateTransactionStatus(transactionId, newStatus)
    } catch (err) {
      console.error("Error updating transaction status:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Cargando transacciones...</p>
      </div>
    )
  }

  return (
    <RoleGuard
      allowedRoles={["ADMIN", "PROPIETARIO", "ALMACENISTA", "USER"]}
      currentUserRole={currentUserRole}
    >
      <div className="container py-4">
        <Header title="Transacciones" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Gestión de Transacciones</h2>
            <p className="text-muted">Monitorea y gestiona todas las transacciones del sistema</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              <i className="fas fa-file-export me-1" />
              Exportar
            </button>
            <button className="btn btn-outline-secondary">
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
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="fas fa-ellipsis-v" />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                <i className="fas fa-eye me-2" />
                                Ver detalles
                              </button>
                            </li>
                            {transaction.status === "pending" && (
                              <>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleStatusUpdate(transaction.id, "completed")}
                                  >
                                    <i className="fas fa-check-circle me-2" />
                                    Marcar como completado
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleStatusUpdate(transaction.id, "cancelled")}
                                  >
                                    <i className="fas fa-times-circle me-2" />
                                    Cancelar
                                  </button>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
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
      </div>
    </RoleGuard>
  )
}
