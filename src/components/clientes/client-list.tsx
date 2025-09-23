"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import  { type Client } from "../../types/Client"
import { useAuth } from "../../contexts/auth-context"
import { fetchClients, deleteClient, updateClient } from "../../services/client-service "
import { ROLES } from "../../types/roles"
import { AxiosError} from "axios";



export default function ClientManagement(){
  const {user, isAuthenticated, hasPermission, token} = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError]= useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient]= useState<Client | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 20
  
  const handleEditClick=()=>{
      navigate("/client-registration");
    }

  useEffect(()=>{
    const loadClients = async() => {
      if(!isAuthenticated){
        navigate("/")
        return
      }
      const {clients, totalPages} = await fetchClients(currentPage, limit)
      setClients(clients)
      setTotalPages(totalPages)
      setError(null)
    }

    if(!hasPermission(ROLES.ADMIN)){
      console.log("Usuario sin Rol admin o manager")
      setError("Acceso denegado: requiere rol Admin o Manager")
      setIsLoading(false)
      return
    }

    loadClients()
  },[currentPage, hasPermission, navigate,isAuthenticated,token, user]);

  const goToPage = (page: number) =>{
    if(page >= 1  && page <= totalPages){
      setCurrentPage(page)
    }
  };



  const searchClients = (c: Client, q:string)=>
   
    c.firstName.toLowerCase().includes(q.toLowerCase()) ||
    c.email.toLowerCase().includes(q.toLowerCase()) ||
    c.phone?.toLowerCase().includes(q.toLowerCase())

  const filteredClients = Array.isArray(clients)
  ? clients.filter(c => (c.firstName as string) && searchClients(c, searchTerm))
   :[]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentClient) return;
    const { name, value } = e.target;

    if (name === "isActive") {
      setCurrentClient({ ...currentClient, isActive: value === "true" });
      return;
    }  

    setCurrentClient({ ...currentClient, [name]: value } as Client);
  };

  const handleEditClient = (c: Client) => {
    setCurrentClient({
      ...c,
      firstName:c.firstName,
      lastName:c.lastName,
      email: c.email,
      phone:c.phone,
      address:c.address,      
      isActive: true,   
    });
    setShowModal(true);
  };

  const handleDeleteClient = async (id: string) => {
    if(window.confirm("¿Estás seguro de querer eliminar este usuario?")){
      try{
        const result = await deleteClient(id);
        if(result){
        setClients(clients.filter(Client => Client.id !== id));
        setShowModal(false);
        } else {
          throw new Error(result || "No se pudo eliminar el usuario. Intenta de nuevo.");
        }
      } catch (err: unknown) {
       if(err instanceof AxiosError){
        console.error("Axios Error al eliminar usuario:", err.response?.status, err.response?.data);
       }
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if(!currentClient) return;
    try {
      if(currentClient.id){
        const updatedClient = await updateClient(currentClient.id, {
        firstName: currentClient.firstName,
        lastName: currentClient.lastName,
        email: currentClient.email,
        phone:currentClient.phone,
        address: currentClient.address,
        isActive:currentClient.isActive,     
        
      });
  
      if(!updatedClient) throw new Error(" no puedo actualizar el usuario. Intenta de Nuevo")
        setClients((prev)=> prev.map((c)=>(c.id === currentClient.id ? updatedClient : c)));
  
      }
    } catch (err) {
       if (err instanceof AxiosError) {
          console.error("Axios Error al crear/actualizar usuario:", err.response?.status, err.response?.data);
          setError(err.response?.data?.message || "Error al crear/actualizar el usuario. Intenta de nuevo.");
        } else if (err instanceof Error) {
          console.error("Error al crear/actualizar usuario:", err.message);
          setError(err.message || "Error al crear/actualizar el usuario. Intenta de nuevo.");
        } else {
          console.error("Error desconocido al crear/actualizar usuario:", err);
          setError("Error desconocido al crear/actualizar el usuario. Intenta de nuevo.");
        }
      }
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
                <th scope="col">Correo</th>
                <th scope="col">Telefono</th>
                <th scope="col">Status</th>
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
                        {client.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-medium">{client.firstName}</div>
                        <div className="small text-muted">{client.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{client.email}</td>
                 
                  <td className="text-secondary">{client.phone}</td>
                  <td className="text-secondary">{(client.isActive).toString()}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="fas fa-edit" onClick={()=> handleEditClient(client)}></i>
                    </button>
                    <button className="btn btn-sm btn-outline-success me-2">
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash-alt" onClick={()=> handleDeleteClient(client.id)}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
               <div style={{ marginTop: "20px" }}>
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          );
        })}
        <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
        </div>


  {showModal  &&  (
        <div  className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cliente</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Nombre 
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={currentClient?.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                    <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={currentClient?.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value= {currentClient?.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">                      
                      Telefono
                    </label>
                    <input
                      type="phone"
                      className="form-control"
                      id="phone"
                      name="Telefono"
                      value= {currentClient?.phone || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                   <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Direccion
                    </label>
                    <input
                      type="address"
                      className="form-control"
                      id="address"
                      name="address"
                      value= {currentClient?.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-select"
                      id="role_add"
                      name="role"
                      value= {currentClient?.isActive ? "Activo" : "Inactivo"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Escoje Status</option>
                      <option value="">Activo</option>
                      <option value="Administrator">Inactivo</option>
                     
                    </select>
                  </div>           

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success"onClick={()=> setShowModal(false)}>Actualizar</button>       
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


  </div>



    
  )
}
