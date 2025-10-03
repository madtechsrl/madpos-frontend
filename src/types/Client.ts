
export type Client = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  creditLimit: number;
  currentBalance: number;
  status: "Activo" | "Inactivo" | "Suspendido"
  identificationNumber?: string;
  fiscalCode?: string;
  isActive?: boolean;
  createAt: string;
  lastPurchase?:string;
  totalPurchases:number
  notes?: string  
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: string;
  fiscalCode?: string;
  isActive?: boolean; 
}

export interface UpdateClientRequest {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: string;
  fiscalCode?: string;
  isActive?: boolean; 
}

export interface PaginatedClientResponse {
  clients: Client[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  sortBy: string;
  order: "ASC" | "DESC";
}




