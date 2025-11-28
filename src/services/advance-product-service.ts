import axiosInstance from "../lib/api"
import type { Product} from "../types/products"

type ListPayLoad<T> = {records?:T[]; total?: number; page?: number};
type ApiListResponse<T> = { data?: ListPayLoad<T> };
type ApiItemResponse<T> = { data?: T | { record?: T } };

export async function fetchAdvancedProducts(): Promise<Product[]> {
 try {
    const response = await axiosInstance.get<ApiListResponse<Product>>("/v1/products")
    const records = response.data?.data?.records ?? [];

    if(!Array.isArray(records)){
      console.error("fetchProducts: Invalid response format. Expected array, got:", response.data) 
      return[]    
    }
    return records; 

} catch (error) {
     console.error("Error fetching Products:", error)
    return [];
 }
}

export async function createAdvancedProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt" | "createdBy" | "lastModifiedBy">,
): Promise<Product> {
  await axiosInstance.post<ApiItemResponse<Product>>("/v1/products")
  const newProduct: Product = {
    ...product,
    id: `prod${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
  }
 
  return newProduct
}

export async function updateAdvancedProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
try {
  const response = await axiosInstance.put<ApiItemResponse<Product>>(`/v1/products/${id}`, updates);
  const data = response.data?.data;
  if(!data) return null;
  if(typeof(data as {record?: Product}).record !=="undefined"){
    return (data as {record?: Product}).record ?? null;
  }
  return (data as Product) ?? null;
} catch (error) {
  console.error(`Error editnado producto con ID ${id}`, error)
  return null  
  }
}

export async function deleteAdvancedProduct(id: string): Promise<boolean> {
 try {
  const response = await axiosInstance.delete(`/v1/products/${id}`)
  return response.status >= 200 && response.status < 300
 } catch (error) {
  console.error(`Error borrando producto con ID ${id}`, error) 
 return false  
 }
 
}

// Funciones auxiliares
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
try {
  const response = await axiosInstance.get(`/v1/product`,{
    params: {categoryId}
  })
  const data = response.data?.data ?? []

    if (!Array.isArray(data)) {
      console.error("getProductsByCategory: Invalid response format. Expected array, got:", data)
      return []
    }
    return data as Product[]
} catch (error) {
   console.error("getProductsByCategory: API request failed", error)
    return []
}

}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
 try {
  const response = await axiosInstance.get(`/v1/product`,{
    params: {brandId}
  })
  const data = response.data?.data ?? []

    if (!Array.isArray(data)) {
      console.error("getProductsByCategory: Invalid response format. Expected array, got:", data)
      return []
    }
    return data as Product[]
} catch (error) {
   console.error("getProductsByCategory: API request failed", error)
    return []
}
}

export async function getLowStockProducts(): Promise<Product[]> {
 try {
  const response = await axiosInstance.get(`/v1/product`,{
    params: {stock: "low"}
  })
  const data = response.data?.data ?? []

    if (!Array.isArray(data)) {
      console.error("getProductsByCategory: Invalid response format. Expected array, got:", data)
      return []
    }
    return data as Product[]
} catch (error) {
   console.error("getProductsByCategory: API request failed", error)
    return []
}
}

// export async function getProductMovements(productId: string): Promise<InventoryMovement[]> {
 
// }
