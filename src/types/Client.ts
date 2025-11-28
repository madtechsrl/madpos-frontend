
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  creditLimit: number;
  currentBalance: number;
  status: "Activo" | "Inactivo" | "Suspendido"
  identificationNumber?: number;
  fiscalCode?: number;
  taxId: string;
  isActive?: boolean;
  createAt: string;
  lastPurchase?:number;
  totalPurchases:number
  notes?: string  
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: number;
  fiscalCode?: number;
  isActive?: boolean; 
}

export interface UpdateClientRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: number;
  fiscalCode?: number;
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




