"use client"

import { useState } from "react"
import type { TransactionFilters } from "../../types/transacion"

interface TransactionFiltersProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
  onClearFilters: () => void
}

export function TransactionFiltersComponent({ filters, onFiltersChange, onClearFilters }: TransactionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters)

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-filter me-2"></i>
            <strong>Filtros</strong>
            {activeFiltersCount > 0 && (
              <span className="badge bg-secondary">{activeFiltersCount} activos</span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button className="btn btn-outline-secondary btn-sm" onClick={handleClearFilters}>
              <i className="fas fa-times me-1"></i>
              Limpiar
            </button>
          )}
        </div>

        <div className="row g-3">
          {/* Search */}
          <div className="col-md-6 col-lg-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar transacciones..."
                value={localFilters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="col-md-6 col-lg-3">
            <select
              className="form-select"
              value={localFilters.type || "all"}
              onChange={(e) => handleFilterChange("type", e.target.value || undefined)}
            >
              <option value="all">Todos los tipos</option>
              <option value="sale">Venta</option>
              <option value="return">Devolución</option>
              <option value="refund">Reembolso</option>
              <option value="adjustment">Ajuste</option>
              <option value="payment">Pago</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-6 col-lg-3">
            <select
              className="form-select"
              value={localFilters.status || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
              <option value="failed">Fallido</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="col-md-6 col-lg-3">
            <select
              className="form-select"
              value={localFilters.paymentMethod || "all"}
              onChange={(e) => handleFilterChange("paymentMethod", e.target.value || undefined)}
            >
              <option value="all">Todos los métodos</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="check">Cheque</option>
              <option value="credit">Crédito</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
