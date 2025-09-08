// import { ROLES } from "../types/User";
import axiosInstance from "../lib/api";
import type { Product } from "../contexts/product-context";




// Get all products
// export async function fetchProducts(): Promise<Product[]> {
//   const accessToken = checkToken()
//   try {
   
//     const response = await axiosInstance.get("/v1/products",{
//       headers:{
//         Authorization: `Bearer ${accessToken}`
//       }
//     })
//     console.log("fetchProducts: Response from", axiosInstance, response.data)

//     const products = response.data?.data?.records || []

//     if(!Array.isArray(products)){
//       console.error("fetchProducts: Invalid response format. Expected array, got:", products)     
//     }
//     const mappedProducts = products.map((product: Product) => ({
//       ...product,      
//     }))
//     // console.log("fetchUsers: Mapped Products", mappedProducts)
//     return mappedProducts; 
//   } catch (error) {
//     console.error("Error fetching Products:", error)
//     return []
//   }
// }

// export async function fetchProductsId(id: string): Promise<Product | null> {
//   try {
//     const response = await axiosInstance.get(`/v1/products/${id}`)
//     return response.data?.data?.records || null
//   } catch (error) {
//     console.error(`Error cargando productos con ID ${id}:`, error)
//     return null
//   }
// }

// export async function editProductId(id: string): Promise <Product | null>{
//   try {
//     const response = await axiosInstance.put(`/v1/products/${id}`)
//     return response.data?.data?.records || null
//   } catch (error) {
//     console.error(`Error editando producto con ID ${id}:`, error)
//     return null
//   }
// }

// export async function deleteProduct(id: string): Promise<boolean> {
//   try {
//     const response = await axiosInstance.delete(`/v1/products/${id}`)
//     return response.data?.data?.records || false
//   } catch (error) {
//     console.error(`Error borrando producto con ID ${id}:`, error)
//     return false
//   }
  
// }

/** API response envelopes (adjust to match your backend) */
type ListEnvelope<T> = { data: { records: T[] } };
type OneEnvelope<T>  = { data: { record: T } };
type DeleteEnvelope  = { success?: boolean }; // some APIs return 204 with no body

export type ProductUpdate = Partial<
  Pick<
    Product,
   |"name" | "cost" | "barcode" | "sku" | "brand" | "description" | "image" | "bgColor"
   | "category" | "price" | "model" | "minStock" | "stock" | "textColor" | "warehouse" 
  >
> & {
  categoryId?: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await axiosInstance.get<ListEnvelope<Product>>("/v1/products");
  return data.data.records;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data } = await axiosInstance.get<OneEnvelope<Product>>(`/v1/products/${id}`);
  return data.data.record ?? null;
}

export async function updateProduct(id: string, payload: ProductUpdate): Promise<Product> {
  const { data } = await axiosInstance.put<OneEnvelope<Product>>(`/v1/products/${id}`, payload);
  return data.data.record;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await axiosInstance.delete<DeleteEnvelope>(`/v1/products/${id}`);
  // treat 200/204 as success
  if (res.status === 204) return true;
  if (res.status === 200) return res.data.success ?? true;
  return false;
}