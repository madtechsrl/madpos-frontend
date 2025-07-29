"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Mock clients data
const mockClients = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1 849 123 4567",
    balance: 1500.0,
    orders: 5,
    lastOrder: "2023-05-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1 849 987 6543",
    balance: -250.0,
    orders: 3,
    lastOrder: "2023-05-12",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "+1 849 555 0123",
    balance: 0.0,
    orders: 8,
    lastOrder: "2023-05-10",
  },
]



export function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )


 const handleEditClick=()=>{
      navigate("/client-registration");
    }

  return (
    <div>
      <div className="d-flex flex-row  justify-content-between align-items-center mb-4">
        {/* <h2 className="fs-4 fw-semibold">Gestión de Clientes</h2> */}
         <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
              </button>
       <button className="btn btn-primary" onClick={handleEditClick}>
          <i className="fas fa-plus me-2"></i> Nuevo Cliente
        </button>
      </div>

      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Contacto</th>
                <th scope="col">Saldo</th>
                <th scope="col">Pedidos</th>
                <th scope="col">Último Pedido</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-secondary text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-medium">{client.name}</div>
                        <div className="small text-muted">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{client.phone}</td>
                  <td>
                    <span
                      className={`fw-medium ${client.balance > 0 ? "text-success" : client.balance < 0 ? "text-danger" : "text-muted"}`}
                    >
                      RD${client.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-secondary">{client.orders}</td>
                  <td className="text-secondary">{client.lastOrder}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-success me-2">
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
