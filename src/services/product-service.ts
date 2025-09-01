// import { ROLES } from "../types/User";
import axiosInstance from "../lib/api";
import type { Product } from "../contexts/product-context";

const checkToken = ()=> {
  const token = localStorage.getItem("token")
  if(!token){
    throw new Error("No token found, cannot fetch users")
  }
  // console.log("checkToken: Token found", token)
  return token
}

// Get all products
export async function fetchProducts(): Promise<Product[]> {
  const accessToken = checkToken()
  try {
   
    const response = await axiosInstance.get("/v1/products",{
      headers:{
        Authorization: `Bearer ${accessToken}`
      }
    })
    // console.log("fetchProducts: Response from", axiosInstance, response.data)

    const products = response.data?.data?.records || []

    if(!Array.isArray(products)){
      console.error("fetchProducts: Invalid response format. Expected array, got:", products)     
    }
    const mappedProducts = products.map((product: Product) => ({
      ...product,      
    }))
    // console.log("fetchUsers: Mapped Products", mappedProducts)
    return mappedProducts; 
  } catch (error) {
    console.error("Error fetching Products:", error)
    return []
  }
}

export async function fetchProductsId(id: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.get(`/v1/products/${id}`)
    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error cargando productos con ID ${id}:`, error)
    return null
  }
}

export async function editProductId(id: string): Promise <Product | null>{
  try {
    const response = await axiosInstance.put(`/v1/products/${id}`)
    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error editando producto con ID ${id}:`, error)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await axiosInstance.delete(`/v1/products/${id}`)
    return response.data?.data?.records || false
  } catch (error) {
    console.error(`Error borrando producto con ID ${id}:`, error)
    return false
  }
  
}