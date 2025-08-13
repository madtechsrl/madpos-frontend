// import { ROLES } from "../types/User";
import axiosInstance from "../lib/api";
import type { Product } from "../contexts/product-context";

// MockAPI URL - replace with your actual MockAPI endpoint
// const MOCKAPI_URL = "http://localhost:8184"

// export async function fetchProducts(): Promise<Product[]> {
//   try {
//     const response = await fetch(MOCKAPI_URL)

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`)
//     }

//     const data = await response.json()

//     // If the API is down or not available, use fallback data
//     if (!data || data.length === 0) {
//       return getFallbackProducts()
//     }

//     return data
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     // Return fallback data if the API call fails
//     return getFallbackProducts()
//   }
// }

// Fallback data in case the API is unavailable
// function getFallbackProducts(): Product[] {
//   return [
//     {
//       id: "alp001",
//       name: "Alphazap",
//       price: 12341.0,
//       category: "Electrónicos",
//       image: "/placeholder.svg?height=100&width=100",
//       bgColor: "bg-yellow-100",
//     },
//     {
//       id: "car002",
//       name: "Cardify",
//       price: 4123.0,
//       category: "Software",
//       image: "/placeholder.svg?height=100&width=100",
//       bgColor: "bg-gray-100",
//     },
//     {
//       id: "fix003",
//       name: "Fix San",
//       price: 123124.0,
//       category: "Automotriz",
//       image: "/placeholder.svg?height=100&width=100",
//       bgColor: "bg-gray-100",
//     },
//     {
//       id: "hol004",
//       name: "Holdla",
//       price: 123.0,
//       category: "Servicios",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "ran005",
//       name: "Rank",
//       price: 200.0,
//       category: "Software",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "reg006",
//       name: "Regran",
//       price: 231.0,
//       category: "Servicios",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "sti007",
//       name: "Stim",
//       price: 1231.0,
//       category: "Electrónicos",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "str008",
//       name: "String",
//       price: 234.0,
//       category: "Materiales",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "tem009",
//       name: "Temp",
//       price: 100.0,
//       category: "Hogar",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//     {
//       id: "wra010",
//       name: "Wrapsa",
//       price: 2213.0,
//       category: "Embalaje",
//       bgColor: "bg-slate-600",
//       textColor: "text-white",
//     },
//   ]
// }


// const roleMapping: Record<string, string> = {
//   "ADMIN": ROLES.ADMIN,
//   "CAJERO": ROLES.CAJERO,
//   "USUARIO": ROLES.USER,
//   "PROPIETARIO": ROLES.PROPIETARIO,
//   "ALMACENISTA": ROLES.ALMACENISTA
// }


const checkToken = ()=>{
  const token = localStorage.getItem("token")
  if(!token){
    throw new Error("No token found, cannot fetch users")
  }
  console.log("checkToken: Token found", token)
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

    console.log("fetchUsers: Response from", axiosInstance, response.data)

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