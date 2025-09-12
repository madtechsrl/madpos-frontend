"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { createUser, deleteUser, updateUser } from "../../services/user-service";
import type { User } from "../../types/User";
import { UserRole,  getRoleConfig, mapRoleToUuid, mapUuidToRole, } from "../../types/roles";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/api";
import { AxiosError, isAxiosError } from "axios";


const rolePermissions = {
  [UserRole.MANAGER]: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: [UserRole.CASHIER],
    badge: "bg-danger",
    badgeClass: "bg-danger",
  },
  [UserRole.ADMIN]: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: [UserRole.ADMIN], [UserRole.CASHIER]: [UserRole.MANAGER],
    badge: "bg-primary",
    badgeClass: "bg-primary",
  },
  [UserRole.CASHIER]: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-secondary",
    badgeClass: "bg-secondary",
  },
}


interface UserManagementProps {
  compact?: boolean;
}

export default function UserManagement({ compact = false }: UserManagementProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isAuthenticated, hasPermission , register, token, setToken} = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate(); 
 // para mapeo
 
 const toCode = (uuid?: string)=> mapUuidToRole(uuid ?? "")
 const toUuid = (code: UserRole) => mapUuidToRole(code)


// Fetch users
useEffect(() => {
  async function loadUsers() {
    if (!isAuthenticated) {
      // console.log("UserManagement: No autenticado, redirigiendo a /login");
      navigate("/");
      return;
    }

    if (!hasPermission(UserRole.ADMIN)) {
      console.log("UserManagement: Usuario sin rol ADMIN", { role: user?.role });
      setError("Acceso denegado: se requiere rol de administrador");
      setIsLoading(false);
      return;
    }

    try {
      // console.log("UserManagement: Obteniendo usuarios");
      const response = await axiosInstance.get("/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const fetchedUsers: User[] = response.data?.data?.records || [];    
      setUsers(fetchedUsers);
      setError(null);
    } catch (err: unknown) {
   if (isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }
    setError(err.response?.data?.message ?? err.message);
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("No se pudieron cargar los usuarios. Intenta de nuevo.");
  }
    } finally {
      setIsLoading(false);
    }
  }

  loadUsers();
}, [isAuthenticated, hasPermission, navigate, user, token]);  
 
type RoleTab = "all" | "administradores" | "propietarios" | "cajeros";

const roleMatchesTab = (roleUuid: string | undefined, tab: RoleTab) => {
  const code = toCode(roleUuid);
  if (tab === "administradores") return code === UserRole.ADMIN;
  if (tab === "propietarios")   return code === UserRole.MANAGER;
  if (tab === "cajeros")        return code === UserRole.CASHIER;
  return true; // "all"
};



const searchMatches = (u: User, q: string) =>
  u.fullname.toLowerCase().includes(q.toLowerCase()) ||
  u.email.toLowerCase().includes(q.toLowerCase());


const filteredUsers = Array.isArray(users)
  ? users.filter(u => roleMatchesTab(u.role as string, activeTab ) && searchMatches(u, searchTerm))
  : [];
 const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers;

 

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  if (!currentUser) return;
  const { name, value } = e.target;

  if(name === "enabled"){
    setCurrentUser({
      ...currentUser,
      enabled: value === "true",
    });
    return;
  }else{
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  }  
 };


const handleAddUser = () => {
  setCurrentUser({
    id: "",
    email: "",
    fullname: "",
    password: "",
    role: toUuid(UserRole.CASHIER),
    enabled: true,
    createdAt: new Date().toISOString(),
  });
  setShowModal(true);
};

const handleEditUser = (u: User) =>{
  setCurrentUser({
    id: u.id,
    email: u.email,
    fullname: u.fullname,
    password: "",
    role: u.role,
    enabled: u.enabled,
    createdAt: u.createdAt,
  });
  setShowModal(true);
};
  

const handleDeleteUser = async (id: string) => {
  if(window.confirm("¿Estás seguro de querer eliminar este usuario?")){
    try{
      const result = await deleteUser(id);
      if(result){
      setUsers(users.filter(user => user.id !== id));
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


const handleSubmit = async (e: React.FormEvent) =>{
  e.preventDefault();
  if(!currentUser){
    return;
  }
  try{
    if(currentUser.id){
      const updatedUser = await updateUser(currentUser.id,{
        fullname: currentUser.fullname,
        email: currentUser.email,
        role: currentUser.role,
        ...(currentUser.password ? {password : currentUser.password}: {})
      });
      if(updatedUser){
        setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));        
      } else {
        throw new Error("No se pudo actualizar el usuario. Intenta de nuevo.");
      }
    } else {
      const newUser = await createUser({
        fullname: currentUser.fullname,
        email: currentUser.email,
        password: currentUser.password ,
        role: toCode(currentUser.role),
        enabled: currentUser.enabled,
        createdAt: currentUser.createdAt
      })
      if (!newUser) throw new Error("No se pudo crear usuario")
        setUsers([...users, newUser])
        
        
        await register(
          currentUser.fullname ?? "",
          currentUser.email ?? "",
          currentUser.password ?? "",
          mapUuidToRole(currentUser.role as string) ?? "",
          mapRoleToUuid,
          currentUser.enabled,
            
          
        );
   
    }
      setShowModal(false);
      setError(null);
      
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      console.error("Axios Error al crear/actualizar usuario:", err.response?.status, err.response?.data);
      setError(err.response?.data?.message || "Error al crear/actualizar el usuario. Intenta de nuevo.");
    }
    else if (err instanceof Error)  {
      console.error("Error al crear/actualizar usuario:", err.message);
      setError(err.message || "Error al crear/actualizar el usuario. Intenta de nuevo.");
    }else {
      console.error("Error desconocido al crear/actualizar usuario:", err);
      setError("Error desconocido al crear/actualizar el usuario. Intenta de nuevo.");
    }
  }
    
}




const userCounts = {
  all: users.length,
  admin:  users.filter(u => toCode(u.role) === UserRole.ADMIN).length,
  manager: users.filter(u => toCode(u.role) === UserRole.MANAGER).length,
  cashier: users.filter(u => toCode(u.role) === UserRole.CASHIER).length,
};

 

 
  if (isloading && users.length === 0) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    )
  }


  return (
    <div className="container-fluid px-0">
      {!compact && (        
        <div className="d-flex justify-content-lg-between align-items-center mb-4">
          <div>
          {/* <h2 className="fs-4 fw-semibold mb-1">Usuarios del Sistema</h2> */}
          <p className="text-secondary">
            Gestiona los usuarios del sistema y sus niveles de acceso. Cada rol tiene diferentes permisos y capacidades.
          </p>
        </div>

          <h2 className="fs-4 fw-semibold mb-1"></h2>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleAddUser} disabled={isloading}>
            <i><FontAwesomeIcon icon={faPlus} /></i>
            <span>Añadir Usuario</span>
          </button>
        </div>
      )}

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

      {!compact && (
        <div className="row mb-4">
          <div className="col">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        </div>
      )}

<div className="mb-4">
<div className="nav nav-pills mb-3" role="tablist">
          <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Todos <span className="badge bg-light text-dark ms-1">{userCounts.all}</span>
          </button>
          </li>
          <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${activeTab === 'propietarios' ? "active" : ""}`}
            onClick={() => setActiveTab('propietarios')}
          >
            Propietarios <span className="badge bg-light text-dark ms-1">{userCounts.manager}</span>
          </button>
          </li>
          <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${activeTab === 'administradores' ? "active" : ""}`}
            onClick={() => setActiveTab('administradores')}
          >
            Administradores <span className="badge bg-light text-dark ms-1">{userCounts.admin}</span>
          </button>
          </li>
          <button
            type="button"
            className={`nav-link ${activeTab === 'cajeros' ? "active" : ""}`}
            onClick={() => setActiveTab('cajeros')}
          >
            Cajeros <span className="badge bg-light text-dark ms-1">{userCounts.cashier}</span>
          </button>
       
        </div>
      </div>

      <div className={compact ? "" : "card shadow-sm"}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Creación</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-medium">{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>
                    <span className={`badge bg-${getRoleConfig(mapUuidToRole(u.role ?? "")).badgeColor}`}>
                    {getRoleConfig(mapUuidToRole(u.role ?? "")).label}
                    </span>

                    {/* <span className={`badge bg-${roleConf?.badgeColor ?? "secondary"}`}>
                      {roleConf?.label ?? ` (${user.role ?? "undefined"})`}
                    </span> */}

                    </td>
                    {!compact && <td className="text-secondary">{u.createdAt || "-"}</td>}
                    <td>
                      <span className={`badge ${u.enabled ? "bg-success" : "bg-danger"}`}>
                        {u.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(u)}>
                        <i><FontAwesomeIcon icon={faEdit} /></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id)}>
                        <i><FontAwesomeIcon icon={faTrash} /></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={compact ? 5 : 6} className="text-center py-4">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {compact && filteredUsers.length > 5 && (
          <div className="p-3 text-center border-top">
            <Link to="/usuarios" className="btn btn-sm btn-outline-primary">
              Ver todos los usuarios <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        )}

        {compact && (
          <div className="p-2 text-end border-top">
            <button className="btn btn-success btn-sm" onClick={handleAddUser}>
              <i><FontAwesomeIcon icon={faPlus} /></i> Añadir Usuario
            </button>
          </div>
        )}
      </div>


      <h3 className="fs-5 fw-semibold mb-3">UserRole y Permisos</h3>
      <div className="row">
        {Object.entries(rolePermissions).map(([role, info]) => (
          <div className="col-md-4 mb-3" key={role}>
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{info.label}</h5>
                <span className={`badge ${info.badge}`}>{role}</span>
              </div>
              <div className="card-body">
                <p className="card-text">{info.description}</p>
                <h6 className="mt-3 mb-2">Puede gestionar:</h6>
                <ul className="list-unstyled">
                  {info.canManage.length > 0 ? (
                    info.canManage.map((managedRole) => (
                      <li key={managedRole} className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {rolePermissions[managedRole as keyof typeof rolePermissions]?.label || managedRole}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">
                      <i className="fas fa-times-circle me-2"></i>
                      No puede gestionar usuarios
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{currentUser?.id ? "Editar Usuario" : "Añadir Usuario"}</h5>
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
                    <label htmlFor="fullname" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"                      
                      id="fullname"
                      name="fullname"
                      value={currentUser?.fullname}
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
                      value={currentUser?.email}
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
                      id="role"
                      name="role"
                      value={currentUser?.role}
                      onChange={((e)=>{
                        if(!currentUser) return;
                        setCurrentUser({...currentUser, role:e.target.value as unknown as UserRole})
                      })}
                      required
                    > 
                      <option value="">Selecione Rol</option>
                      <option value={UserRole.CASHIER}>Cajero</option>
                      <option value={UserRole.ADMIN}>Administrador</option>
                      <option value={UserRole.MANAGER}>Propietario</option>                                       
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      {currentUser?.id ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={currentUser?.password}
                      onChange={handleInputChange}
                      required={!currentUser?.id}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="enabled" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="enabled"
                      name="enabled"
                      value={currentUser?.enabled ? "true" : "false"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {currentUser?.id ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  




}