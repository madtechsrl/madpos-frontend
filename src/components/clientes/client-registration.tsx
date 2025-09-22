import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatCurrency } from "../../lib/utils"
import type { CreateClientRequest } from "../../types/Client"




export function ClientRegistrationForm() {
  const navigate = useNavigate()
//   const { customerName } = useUser()

  // Form state
  const [allowCredit, setAllowCredit] = useState(false)
  const [clientData, setClientData] = useState<CreateClientRequest>({
    firstName: "",
    lastName: "",   
    email: "",
    phone:"",    
    address: "",
    identificationNumber:"",
    fiscalCode: "",
    isActive: true,
  })

  // Account state
  const [currentBalance] = useState(0)
  const [hasOrders] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setClientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically save the client data
    console.log("Saving client:", clientData)
    // Navigate back to clients list
    navigate("/clientes")
  }

  const handleNewOrder = () => {
    // Navigate to create new order for this client
    navigate("/")
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Sub Header */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
             <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
              </button> 

            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Permitir ventas a crédito</span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={allowCredit}
                  onChange={(e) => setAllowCredit(e.target.checked)}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary">
                <i className="fas fa-trash"></i>
              </button>
              <button className="btn btn-success">Nuevo pedido</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid px-4 py-4">
        <div className="row">
          {/* Left Column - Registration Form */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Profile Picture */}
                <div className="text-center mb-4">
                  <div
                    className="bg-secondary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <i className="fas fa-user fa-3x text-white"></i>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="mb-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Nombre"
                      value={clientData.firstName}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="N° ID"
                      value={clientData.identificationNumber}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    />
                  </div>

                  {/* <div className="mb-4">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Observaciones"
                      value={clientData.observations}
                      onChange={(e) => handleInputChange("observations", e.target.value)}
                      style={{ resize: "none" }}
                    ></textarea>
                  </div> */}
                </div>

                {/* Contact Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Contacto</h6>

                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={clientData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Teléfono/Celular</label>
                    
                      {/* <select
                        className="form-select"
                        style={{ maxWidth: "80px" }}
                        value={clientData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      >
                        <option value="CA">🇨🇦</option>
                        <option value="DO">🇩🇴</option>
                        <option value="US">🇺🇸</option>
                      </select> */}
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Telefono/Celular"
                        value={clientData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Status</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ maxWidth: "100px" }}
                        value={clientData.isActive ? "Active": "Inactive"}
                        onChange={(e) => handleInputChange("isActive", e.target.value === "Active")}
                      >
                        <option value="Active">Activo</option>
                        <option value="Inactive">Inactivo</option>                        
                      </select>
                      {/* <input
                        type="tel"
                        className="form-control"
                        value={clientData.landline}
                        onChange={(e) => handleInputChange("landline", e.target.value)}
                      /> */}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Dirección</h6>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dirección"
                      value={clientData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Codigo Fiscal"
                      value={clientData.fiscalCode}
                      onChange={(e) => handleInputChange("complement", e.target.value)}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="d-grid">
                  <button className="btn btn-success btn-lg" onClick={handleSave}>
                    Guardar Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Account Information */}
          <div className="col-12 col-lg-6 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Account Balance */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Cuenta</h6>

                  <div className="text-center mb-4">
                    <div className="text-muted small mb-1">SALDO ACTUAL</div>
                    <div className="h2 fw-bold text-primary mb-3">{formatCurrency(currentBalance)}</div>

                    <div className="d-flex gap-2 justify-content-center">
                      <button className="btn btn-outline-success btn-sm">
                        <i className="fas fa-plus me-1"></i>
                        Añadir
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        <i className="fas fa-minus me-1"></i>
                        Sustraer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders Section */}
                <div className="text-center">
                  {!hasOrders ? (
                    <>
                      <div className="mb-4">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#10b981",
                            color: "white",
                          }}
                        >
                          <i className="fas fa-shopping-basket fa-2x"></i>
                          <div
                            className="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "24px",
                              height: "24px",
                              bottom: "0",
                              right: "0",
                              transform: "translate(25%, 25%)",
                            }}
                          >
                            <i className="fas fa-info-circle text-info"></i>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted mb-4">Este cliente aún no realizó pedidos</p>

                      <button className="btn btn-success" onClick={handleNewOrder}>
                        Nuevo pedido
                      </button>
                    </>
                  ) : (
                    <div>
                      {/* Orders list would go here */}
                      <p>Lista de pedidos del cliente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
