"use client"

import { useState, useEffect } from "react"
import { fetchClients, searchClients } from "../../services/client-service"
import type { Client } from "../../types/Client"

interface ClientSelectorProps {
  selectedClient: Client | null
  onClientSelect: (client: Client | null) => void
  onNewClient: () => void
}

export function ClientSelector({ selectedClient, onClientSelect, onNewClient }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const limit = 10
  // Generic client option
  const genericClient: Client  ={
    id: "",
    firstName: "",
    lastName: "",
    email: "generico@tienda.com",
    phone: "N/A",
    address:"",
    creditLimit: 0,
    currentBalance: 0,
    status: "Activo" as const,
    identificationNumber: 0,
    fiscalCode: 0,
    isActive: true,
    createAt: new Date().toISOString(),
    lastPurchase:0,
    totalPurchases:0,
    notes: "Cliente genérico para ventas sin cliente específico"  
}
  

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await fetchClients(page, limit)
      setClients(data.clients)
    } catch (err) {
      console.error("Error loading clients:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (query.trim()) {
      try {
        const results = await searchClients(query)
        setClients(results)
      } catch (err) {
        console.error("Error searching clients:", err)
      }
    } else {
      loadClients()
    }
  }

  const handleClientSelect = (client: Client | null) => {
    onClientSelect(client)
  }

  const handleClearSelection = () => {
    onClientSelect(null)
  }

  // Filter clients and add generic client to the list
  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery),
  )

  // Add generic client if it matches search or if no search
  const shouldShowGeneric =
    !searchQuery ||
    genericClient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    "general".includes(searchQuery.toLowerCase()) ||
    "generico".includes(searchQuery.toLowerCase())

  const allClients = shouldShowGeneric ? [genericClient, ...filteredClients] : filteredClients

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-6">
          <button
            className={`btn w-100 ${!selectedClient ? "btn-primary" : "btn-outline-primary"}`}
            onClick={handleClearSelection}
          >
            <i className="fas fa-user-slash me-2"></i>
            Sin Cliente
          </button>
        </div>
        <div className="col-6">
          <button className="btn btn-outline-success w-100" onClick={onNewClient}>
            <i className="fas fa-plus me-2"></i>
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="row">
        {allClients.map((client) => {
          const isGeneric = client.id === "generic"
          const isSelected = selectedClient?.id === client.id || (!selectedClient && isGeneric)


          return (
            <div key={client.id} className="col-12 mb-3">
              <div
                className={`card cursor-pointer ${isSelected ? "border-primary bg-light" : ""}`}
                onClick={() => handleClientSelect(isGeneric ? null : client)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body py-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div
                        className={`${isGeneric ? "bg-secondary" : "bg-primary"} text-white rounded-circle d-flex align-items-center justify-content-center`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {isGeneric ? <i className="fas fa-users"></i> : client.firstName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">
                        {client.firstName}
                        {isGeneric && <span className="badge bg-info ms-2">Por defecto</span>}
                      </h6>
                      <div className="text-muted small">{client.email}</div>
                      {!isGeneric && (
                        <>
                          <div className="text-muted small">{client.phone}</div>
                          {client.currentBalance > 0 && (
                            <div className="text-warning small">Balance: ${client.currentBalance.toFixed(2)}</div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-end">
                      <span className={`badge ${client.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                        {client.status}
                      </span>
                      {isSelected && (
                        <div className="mt-1">
                          <i className="fas fa-check-circle text-primary"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {!loading && allClients.length === 0 && searchQuery && (
        <div className="text-center py-4">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h5>No se encontraron clientes</h5>
          <p className="text-muted">No hay clientes que coincidan con tu búsqueda</p>
          <button className="btn btn-primary" onClick={onNewClient}>
            <i className="fas fa-plus me-2"></i>
            Crear Cliente "{searchQuery}"
          </button>
        </div>
      )}
    </div>
  )
}
