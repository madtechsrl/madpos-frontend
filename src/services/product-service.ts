// import { ROLES } from "../types/User";
import axiosInstance from "../lib/api";
import type { Product } from "../contexts/product-context";

type ListPayLoad<T> = {records?:T[]; total?: number; page?: number};
type ApiListResponse<T> = { data?: ListPayLoad<T> };
type ApiItemResponse<T> = { data?: T | { record?: T } };




// Get all products
export async function fetchProducts(): Promise<Product[]> {
  
  try {
   
    const response = await axiosInstance.get<ApiListResponse<Product>>("/v1/products")
     const records = response.data?.data?.records ?? [];
    
    // console.log("fetchProducts: Response from", axiosInstance, response.data)

    // const products = response.data?.data?.records || []

    if(!Array.isArray(records)){
      console.error("fetchProducts: Invalid response format. Expected array, got:", response.data) 
      return[]    
    }
    return records; 
    // console.log("fetchUsers: Mapped Products", mappedProducts)
     } catch (error) {
    console.error("Error fetching Products:", error)
    return [];
  }
}

export async function fetchProductsId(id: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.get<ApiItemResponse<Product>>(`/v1/products/${id}`)
    const data = response.data?.data;
    if(!data) return null;
    if(typeof (data as {record?: Product}).record !== "undefined"){
      return (data as {record?: Product}).record ?? null;
    }
    return (data as Product) ?? null;
  } catch (error) {
    console.error(`Error cargando productos con ID ${id}:`, error)
    return null
  }
}

export async function editProductId(id: string): Promise <Product | null>{
  try {
    const response = await axiosInstance.put<ApiItemResponse<Product>>(`/v1/products/${id}`)
    const data = response.data?.data;
    if (!data) return null;
    if (typeof (data as { record?: Product }).record !== "undefined") {
      return (data as { record?: Product }).record ?? null;
    }
    return (data as Product) ?? null;
  } catch (error) {
    console.error(`Error editando producto con ID ${id}:`, error)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await axiosInstance.delete(`/v1/products/${id}`)
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error borrando producto con ID ${id}:`, error)
    return false
  }
  
}