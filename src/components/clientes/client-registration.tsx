import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatCurrency } from "../../lib/utils"
import type { Client,  CreateClientRequest } from "../../types/Client"
import { useAuth } from "../../contexts/auth-context"
import { ROLES } from "../../types/roles"
import { createClient } from "../../services/client-service"
import logger from "../../lib/logger"

interface ClientManagementProps {
  compact?: boolean;
}

export  function ClientRegistrationForm({compact = false}: ClientManagementProps) {
  const navigate = useNavigate()
  const {user, isAuthenticated, hasPermission} = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [savedClient, setSavedClients] = useState<Client | null>(null)
  const [allowCredit, setAllowCredit] = useState(false)
  const [error, setError]= useState<string | null>(null)
  const [currentClient, setCurrentClient]= useState<CreateClientRequest>({
    firstName: "",
    lastName: "",   
    email: "",
    phone:"",    
    address: "",
    identificationNumber:0,
    fiscalCode: 0,
    isActive: true,
  });
  

  // Account state
  const [currentBalance] = useState(0)
  const [hasOrders] = useState(false)


  useEffect(()=>{
    if(!hasPermission([ROLES.ADMIN, ROLES.MANAGER])){
      console.log("Usuario sin rol admin o manager",{role:user?.role})
       setError("Acceso denegado: se requiere rol de administrador");
      
    }
  },[hasPermission, user, isAuthenticated])

   const handleInputChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
     if (!currentClient) return;
     const { name, value } = e.target;
 
     if (name === "isActive") {
       setCurrentClient({ ...currentClient, isActive: value === "true" });
       }else{
        setCurrentClient({ ...currentClient, [name]: value } as Client);
        }      
   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      logger.debug({currentClient}, "subminting client")
      if(!currentClient) return;
      console.warn("⚠️ currentClient is null");
      try {
        const newClient = await createClient(currentClient);
        logger.info({newClient}, "Client created");
        if(!newClient) throw new Error(" no puedo crear Cliente")
        setClients((prev)=>[...prev, newClient])
        setSavedClients(newClient);

        setCurrentClient({         
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          identificationNumber: 0,
          fiscalCode: 0,
          isActive: true,
        })       
         setTimeout(()=>{
           navigate("/clientes")
         }, 2000)
          
      } catch (error : any) {
        if(error.response?.status === 409){
            setError("Hubo un error al crear al cliente.")
        }else{
          setError("Error inesperado al crear cliente")
        }        
        
      }
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}


        {/* Tarjeta de cliente guardado */}
                {savedClient && (
                  <div className="card mt-4 border-success shadow">
                    <div className="card-body">
                      <h5 className="card-title text-success">
                        Cliente creado exitosamente
                      </h5>
                      <p><strong>ID Cliente:</strong> {savedClient.id}</p>
                      <p>
                        <strong>Nombre:</strong> {savedClient.firstName}{" "}
                        {savedClient.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {savedClient.email || "No proporcionado"}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        {savedClient.isActive ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                  </div>
                )}
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
                  <h6 className="fw-semibold mb-3">Informacion General</h6>
                     {/* <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="N° ID"
                      value={currentClient?.identificationNumber}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="Nombre"
                      value={currentClient?.firstName}
                      onChange={handleInputChange}
                    />
                  </div>   
                   <div className="mb-3">
                    <input
                      type="text"                      
                      className="form-control"
                      name="lastName"
                      placeholder="Apellido"
                      value={currentClient?.lastName}
                      onChange={handleInputChange}
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
                      name="email"
                      placeholder="Email"
                      value={currentClient?.email}
                      onChange={handleInputChange}
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
                        name="phone"
                        placeholder="Telefono/Celular"
                        value={currentClient?.phone}
                        onChange={handleInputChange}
                      />
                    
                  </div>

               

                {/* Address Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Dirección</h6>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Dirección"
                      value={currentClient?.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                     <h6 className="fw-semibold mb-3">Codigo Fiscal</h6>
                    <input
                      type="text"
                      className="form-control"
                      name="fiscalCode"
                      placeholder="Codigo Fiscal"
                      value={currentClient?.fiscalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                <div className="mb-3">
                     <h6 className="fw-semibold mb-3">No. Identificacion</h6>
                    <input
                      type="text"
                      className="form-control"
                      name="identificationNumber"
                      placeholder="Codigo de Identificacion"
                      value={currentClient?.identificationNumber}
                      onChange={handleInputChange}
                    />
                  </div>


                </div>
                

                   <div className="mb-4">
                    <label className="form-label small text-muted">Status</label>
                    <div className="input-group">
                      <select
                        className="form-select form-select-sm"
                        name="isActive"
                        style={{ maxWidth: "100px" }}
                        value={currentClient?.isActive ? "true": "false"}
                        onChange={handleInputChange}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>                        
                      </select>                    
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="d-grid">
                  <button className="btn btn-success btn-lg" onClick={handleSubmit}>
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
