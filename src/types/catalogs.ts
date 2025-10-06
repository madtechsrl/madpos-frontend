export interface BaseCatalog {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Supplier extends BaseCatalog {
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  rnc?: string
  isActive?: boolean
}
