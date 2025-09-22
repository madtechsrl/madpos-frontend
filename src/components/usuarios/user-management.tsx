"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { createUser, deleteUser, fetchUsers, updateUser, type NormalizedUser } from "../../services/user-service";
import type { User } from "../../types/User";
import { mapRoleToUuid, mapUuidToRoleName, ROLES , type RoleKey, type RoleUuid } from "../../types/roles";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AxiosError, isAxiosError } from "axios";



const toRoleUuid = (input?: string) => mapRoleToUuid(input ?? "");
const toRoleKey = (uuid?: string) => (uuid ? mapUuidToRoleName(uuid): "")


type RoleMeta = {
  label: string;
  description: string;
  canManage: RoleKey[];
  badgeClass: string; // Bootstrap class (bg-primary, etc.)
};
const ROLE_META_BY_KEY: Record<RoleKey, RoleMeta> = {
   MANAGER: {
    label: "Propietario",
    description:
      "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: ["CASHIER"],
    badgeClass: "bg-danger",
  },
  ADMIN: {
    label: "Administrador",
    description:
      "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: ["MANAGER", "CASHIER", "ADMIN"], // ajusta si es necesario
    badgeClass: "bg-primary",
  },
  CASHIER: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badgeClass: "bg-secondary",
  },
}

const ROLE_META_BY_UUID: Record<RoleUuid, RoleMeta> = {
  [ROLES.MANAGER]: ROLE_META_BY_KEY.MANAGER,
  [ROLES.ADMIN]: ROLE_META_BY_KEY.ADMIN,
  [ROLES.CASHIER]: ROLE_META_BY_KEY.CASHIER,
};

function ensureRoleUuid(value: string): RoleUuid {
  const all = Object.values(ROLES) as string[];
  return (all.includes(value) ? value : ROLES.CASHIER) as RoleUuid;
}

interface UserManagementProps {
  compact?: boolean;
}


type ModalMode = "anadir" | "editar"

// const emptyUser: User ={
// id:"",
// fullname:"",
// email:"",
// password:"",
// role: ROLES.CASHIER,
// enabled: true,
// createdAt: new Date().toISOString(),
// }

export default function UserManagement({ compact = false }: UserManagementProps) {
  const { user, isAuthenticated, hasPermission , token,} = useAuth();
  const [users, setUsers] = useState<NormalizedUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>("anadir")
  const [currentUser, setCurrentUser] = useState<NormalizedUser | null>(null);
  const navigate = useNavigate(); 

 
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
     const data = await fetchUsers();
      setUsers(data);
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
}, [isAuthenticated, hasPermission, navigate, token, user]);  
 
type RoleTab = "all" | "administradores" | "propietarios" | "cajeros";

const roleMatchesTab = (roleUuid: string | undefined, tab: RoleTab) => {
  const code = toRoleUuid(roleUuid);
  if (tab === "administradores") return code === ROLES.ADMIN;
  if (tab === "propietarios")   return code === ROLES.MANAGER;
  if (tab === "cajeros")        return code === ROLES.CASHIER;
  return true; // "all"
};



const searchMatches = (u: User, q: string) =>
  u.fullname.toLowerCase().includes(q.toLowerCase()) ||
  u.email.toLowerCase().includes(q.toLowerCase());


const filteredUsers = Array.isArray(users)
  ? users.filter(u => roleMatchesTab(u.role as string, activeTab ) && searchMatches(u, searchTerm))
  : [];
 const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers;

// const openAddModal= ()=>{
//   setModalMode("anadir");
//   setCurrentUser({... emptyUser});
//   setShowModal(true);
// }
 
//  const openEditMotal = (u: User) =>{
//   setModalMode("editar");
//   setCurrentUser({
//     id: u.id,
//     fullname: u.fullname ?? "",
//     email: u.email ?? "",
//     password:"",
//     role: toRoleUuid(u.role as string),
//     enabled: !! u.enabled,
//     createdAt: u.createdAt,
//   })
//   setShowModal(true);
// }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentUser) return;
    const { name, value } = e.target;

    if (name === "enabled") {
      setCurrentUser({ ...currentUser, enabled: value === "true" });
      return;
    }

    if (name === "role") {
      // value proviene del <select>, es string → normalizar a UUID
      const roleUuid = ensureRoleUuid(value);
      const roleName = mapUuidToRoleName(roleUuid) || "CASHIER";
      setCurrentUser({ ...currentUser, role: roleUuid, roleUuid, roleName });
      return;
    }

    setCurrentUser({ ...currentUser, [name]: value } as NormalizedUser);
  };



  const handleAddUser = () => {
    setModalMode("anadir");
    setCurrentUser({
      id: "",
      email: "",
      fullname: "",
      password: "",
      role: ROLES.CASHIER,
      roleUuid: ROLES.CASHIER,
      roleName: "CASHIER",
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const handleEditUser = (u: NormalizedUser) => {
    setModalMode("editar");
    setCurrentUser({
      ...u,
      // asegura consistencia:
      role: u.role as RoleUuid,
      roleUuid: u.role as RoleUuid,
      roleName: mapUuidToRoleName(u.role as RoleUuid) || "CASHIER",
      password: "",
      updatedAt: u.updatedAt ?? u.createdAt,
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



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
    if(!currentUser) return;
  try {
    if(currentUser.id){
      const updatedUser = await updateUser(currentUser.id, {
      fullname: currentUser.fullname,
      email: currentUser.email,
      role: currentUser.role as RoleUuid,
      ...(currentUser.password ? {password: currentUser.password}: {})
    });

    if(!updatedUser) throw new Error(" no puedo actualizar el usuario. Intenta de Nuevo")
      setUsers((prev)=> prev.map((u)=>(u.id === currentUser.id ? updatedUser : u)));

    }else{
      //Crear usuario
      const newUser = await createUser({
        fullname: currentUser.fullname,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role as RoleUuid,
        enabled: true,
      });
      if(!newUser) throw new Error(" no puedo crear usuario")
      setUsers((prev)=>[...prev, newUser])
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
  

const userCounts = {
  all: users.length,
  admin:  users.filter(u => toRoleUuid(u.role) === ROLES.ADMIN).length,
  manager: users.filter(u => toRoleUuid(u.role) === ROLES.MANAGER).length,
  cashier: users.filter(u => toRoleUuid(u.role) === ROLES.CASHIER).length,
};

 

 
  // if (isloading && users.length === 0) {
  //   return (
  //     <div className="text-center p-5">
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">Cargando...</span>
  //       </div>
  //       <p className="mt-2">Cargando usuarios...</p>
  //     </div>
  //   )
  // }


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
                displayedUsers.map((u) => {
                  const uuid = toRoleUuid(u.role as string);
                  const meta = ROLE_META_BY_UUID[uuid as RoleUuid];
                  const label = meta?.label ?? toRoleKey(uuid) ?? "—";
                  const badgeClass = meta?.badgeClass ?? "bg-secondary";

                  return (
                    <tr key={u.id}>
                      <td className="fw-medium">{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{label}</span>
                      </td>
                      {!compact && <td className="text-secondary">{u.createdAt || "-"}</td>}
                      <td>
                        <span className={`badge ${u.enabled ? "bg-success" : "bg-danger"}`}>
                          {u.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(u)}>
                          <i>
                            <FontAwesomeIcon icon={faEdit} />
                          </i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id)}>
                          <i>
                            <FontAwesomeIcon icon={faTrash} />
                          </i>
                        </button>
                      </td>
                    </tr>
                  );
                })
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
              <i><FontAwesomeIcon icon={faPlus} />Añadir Usuario</i> 
            </button>
          </div>
        )}
      </div>

          <br />
      <h3 className="fs-5 fw-semibold mb-3">Roles y Permisos</h3>
      <div className="row">
        {(Object.keys(ROLE_META_BY_KEY) as RoleKey[]).map((key) => {
          const meta = ROLE_META_BY_KEY[key];
          // const uuid = ROLES[key]; // por si quieres mostrarlo
          return (
            <div className="col-md-4 mb-3" key={key}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{meta.label}</h5>
                  <span className={`badge ${meta.badgeClass}`}>{key}</span>
                </div>
                <div className="card-body">
                  <p className="card-text">{meta.description}</p>
                  <h6 className="mt-3 mb-2">Puede gestionar:</h6>
                  <ul className="list-unstyled">
                    {meta.canManage.length > 0 ? (
                      meta.canManage.map((managed) => (
                        <li key={`${key}-${managed}`} className="mb-1">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {ROLE_META_BY_KEY[managed].label}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">
                        <i className="fas fa-times-circle me-2"></i>
                        No puede gestionar usuarios
                      </li>
                    )}
                  </ul>
                  {/* <div className="text-muted small">UUID: {uuid}</div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Modal */}
          
      {showModal && modalMode === "anadir" &&  (
        <div key= {modalMode} className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Anadir Usuario</h5>
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
                      className="form-control"
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
                      value= {currentUser?.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">                      
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value= {currentUser?.password || ""}
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
                      value= {currentUser?.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Escoje Rol</option>
                      <option value="Cajero">Cajero</option>
                      <option value="Administrator">Administrador</option>
                      <option value="Propietario">Manager</option>
                     
                    </select>
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
                  <button type="submit" className="btn btn-success">Crear</button>       
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && modalMode === "editar" && currentUser && (
  <div key={modalMode} className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Editar Usuario</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="fullname_edit" className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                id="fullname_edit"
                name="fullname"
                value={currentUser.fullname ?? ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_edit" className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email_edit"
                name="email"
                value={currentUser.email ?? ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role_edit" className="form-label">Rol</label>
              <select
                className="form-select"
                id="role_edit"
                name="role"
                value={toRoleUuid(currentUser.role as string)}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione Rol</option>
                <option value={ROLES.CASHIER}>Cajero</option>
                <option value={ROLES.ADMIN}>Administrador</option>
                <option value={ROLES.MANAGER}>Propietario</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="password_edit" className="form-label">Contraseña (dejar en blanco para no cambiar)</label>
              <input
                type="password"
                className="form-control"
                id="password_edit"
                name="password"
                value={currentUser.password ?? ""}
                onChange={handleInputChange}
                required={false}
                placeholder="Opcional"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="enabled_edit" className="form-label">Estado</label>
              <select
                className="form-select"
                id="enabled_edit"
                name="enabled"
                value={currentUser.enabled ? "true" : "false"}
                onChange={handleInputChange}
                required
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button type="submit" className="btn btn-success">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
  )
  

}


