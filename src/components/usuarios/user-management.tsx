"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { createUser, deleteUser, updateUser } from "../../services/user-service";
import type { User } from "../../types/User";
import { roleDisplayNames, ROLES, roleUuidToCode, getRoleConfig, mapUuidToRole } from "../../types/roles";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import axios from "axios";
import axiosInstance from "../../lib/api";

//  const BASE_URL = "http://localhost:8184"



const rolePermissions = {
  [roleUuidToCode[ROLES.PROPIETARIO]]: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: [roleUuidToCode[ROLES.CAJERO]],
    badge: "bg-danger",
    badgeClass: "bg-danger",
  },
  [roleUuidToCode[ROLES.ADMIN]]: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: [roleUuidToCode[ROLES.ADMIN], roleUuidToCode[ROLES.CAJERO], roleUuidToCode[ROLES.PROPIETARIO]],
    badge: "bg-primary",
    badgeClass: "bg-primary",
  },
  [roleUuidToCode[ROLES.CAJERO]]: {
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
  const { user, isAuthenticated, hasPermission , register, token, setToken} = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  // const roleBadgeColors: { [key: string]: string } = {
  //   ADMIN: "bg-primary",
  //   CAJERO: "bg-info",
  //   MANAGER: "bg-success",
  //   SUPERVISOR: "bg-warning",
  //   EMPLOYEE: "bg-secondary",
  //   CUSTOMER: "bg-dark",
  //   GUEST: "bg-light text-dark",
  //   OTHER: "bg-secondary",
  //   // Add more as needed
  // };
  const role = mapUuidToRole(user?.role ?? "")
  const roleConf = getRoleConfig(role)  


useEffect(() => {
  if (!token || !isAuthenticated) return;
  axiosInstance.get('/v1/auth/profile')
    // .then(() => console.log("UserManagement: Profile valid"))
    .catch(err => console.error("Profile fetch failed", err));
}, [token, isAuthenticated]);


// Fetch users
useEffect(() => {
  async function loadUsers() {
    if (!isAuthenticated) {
      // console.log("UserManagement: No autenticado, redirigiendo a /login");
      navigate("/");
      return;
    }

    if (!hasPermission(ROLES.ADMIN)) {
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
      // console.log("UserManagement: Usuarios obtenidos", fetchedUsers);
      // if (fetchedUsers.length > 0) {
      //   console.log("UserManagement: First user structure", {
      //     id: fetchedUsers[0].id,
      //     role: fetchedUsers[0].role,
      //     fullname: fetchedUsers[0].fullname,
      //     email: fetchedUsers[0].email,
      //     enabled: fetchedUsers[0].enabled,
      //     createdAt: fetchedUsers[0].createdAt,
      //   });
      // }
      setUsers(fetchedUsers);
      setError(null);
    } catch (err: any) {
      console.error("UserManagement: Error", err);
      if (err.message.includes("CORS")) {
        setError("Error de CORS: verifica la configuración del servidor.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("UserManagement: Token inválido o acceso denegado, redirigiendo a /login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        setError(err.message || "No se pudieron cargar los usuarios. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  loadUsers();
}, [isAuthenticated, hasPermission, navigate, user, token]);

    
 


const filteredUsers = Array.isArray(users) ? users.filter((user) => {
  const matchesRole = 
  activeTab === "all" ||   
  activeTab === "administradores" && user.role === ROLES.ADMIN ||
  activeTab === "propietarios" && user.role === ROLES.PROPIETARIO ||
  activeTab === "cajeros" && user.role === ROLES.CAJERO ||
  activeTab === "usuarios" && user.role === ROLES.USER;
  const matchesSearch =
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesRole && matchesSearch;
}) : [];

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
    role: "",
    enabled: true,
    createdAt: new Date().toISOString(),
  });
  setShowModal(true);
};

const handleEditUser = (user: User) =>{
  setCurrentUser({
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    password: "",
    role: user.role,
    enabled: user.enabled,
    createdAt: user.createdAt,
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
    } catch (err: any) {
      console.error("UserManagement: Error al eliminar usuario", err);
      setError(err.message || "No se pudo eliminar el usuario. Intenta de nuevo.");
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
        setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)));        
      } else {
        throw new Error("No se pudo actualizar el usuario. Intenta de nuevo.");
      }
    } else {
      const newUser = await createUser({
        fullname: currentUser.fullname,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        enabled: currentUser.enabled,
        createdAt: currentUser.createdAt
      })
      if (newUser){
        setUsers([...users, newUser])
        await register(
          currentUser.fullname,
          currentUser.email,
          currentUser.password || "",
          currentUser.role || "",
          currentUser.enabled,
          
        )
      }else{
        throw new Error("No se pudo crear el usuario. Intenta de nuevo.");
      }
    }
  } catch (err: any) {
    console.error("UserManagement: Error al crear/actualizar usuario", err);
    setError(err.message || "No se pudo crear/actualizar el usuario. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
  setShowModal(false);
}

const userCounts = {
  all: Array.isArray(users) ? users.length : 0,
  active: Array.isArray(users) ? users.filter(user => user.enabled).length : 0,
  inactive: Array.isArray(users) ? users.filter(user => !user.enabled).length : 0,
  admin: Array.isArray(users) ? users.filter(user => user.role === ROLES.ADMIN).length : 0,
  cajero: Array.isArray(users) ? users.filter(user => user.role === ROLES.CAJERO).length : 0,
  almacenista: Array.isArray(users) ? users.filter(user => user.role === ROLES.ALMACENISTA).length : 0,
  propietario: Array.isArray(users) ? users.filter(user => user.role === ROLES.PROPIETARIO).length : 0,
  usuario: Array.isArray(users) ? users.filter(user => user.role === ROLES.USER).length : 0,
};

 

  ///////////////test2////
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
          <h2 className="fs-4 fw-semibold mb-1">Usuarios del Sistema</h2>
          <p className="text-secondary">
            Gestiona los usuarios del sistema y sus niveles de acceso. Cada rol tiene diferentes permisos y capacidades.
          </p>
        </div>

          <h2 className="fs-4 fw-semibold mb-1">Gestión de Usuarios</h2>
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
            Propietarios <span className="badge bg-light text-dark ms-1">{userCounts.propietario}</span>
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
            Cajeros <span className="badge bg-light text-dark ms-1">{userCounts.cajero}</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'usuarios' ? "active" : ""}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios <span className="badge bg-light text-dark ms-1">{userCounts.usuario}</span>
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
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-medium">{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>
                    <span className={`badge bg-${getRoleConfig(mapUuidToRole(user.role ?? "")).badgeColor}`}>
                    {getRoleConfig(mapUuidToRole(user.role ?? "")).label}
                    </span>

                    {/* <span className={`badge bg-${roleConf?.badgeColor ?? "secondary"}`}>
                      {roleConf?.label ?? ` (${user.role ?? "undefined"})`}
                    </span> */}

                    </td>
                    {!compact && <td className="text-secondary">{user.createdAt || "-"}</td>}
                    <td>
                      <span className={`badge ${user.enabled ? "bg-success" : "bg-danger"}`}>
                        {user.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(user)}>
                        <i><FontAwesomeIcon icon={faEdit} /></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
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


      <h3 className="fs-5 fw-semibold mb-3">Roles y Permisos</h3>
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
                    <label htmlFor="name" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
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
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Cajero">Cajero</option>
                      <option value="Administrator">Administrador</option>
                      <option value="Propietario">Gerente</option>
                      <option value="Almacenista">Supervisor</option>
                      <option value="Usuario">Empleado</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Invitado">Invitado</option>
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
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={currentUser?.enabled ? "Activo" : "Inactivo"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
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