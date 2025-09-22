
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: string;
  fiscalCode?: string;
  isActive: boolean;
  
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: string;
  fiscalCode?: string;
  isActive: boolean; 
}

export interface UpdateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?:string;
  address?:string;
  identificationNumber?: string;
  fiscalCode?: string;
  isActive: boolean; 
}





