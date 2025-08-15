// import { ROLES } from "../types/User";
import axiosInstance from "../lib/api";
import type { Product } from "../contexts/product-context";

// MockAPI URL - replace with your actual MockAPI endpoint
// const MOCKAPI_URL = "http://localhost:8184/v1/products"

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
    // {
    //   id: "alp001",
    //   name: "Alphazap",
    //   price: 12341.0,
    //   category: "Electrónicos",
    //   image: "/placeholder.svg?height=100&width=100",
    //   bgColor: "bg-yellow-100",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "car002",
    //   name: "Cardify",
    //   price: 4123.0,
    //   category: "Software",
    //   image: "/placeholder.svg?height=100&width=100",
    //   bgColor: "bg-gray-100",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "fix003",
    //   name: "Fix San",
    //   price: 123124.0,
    //   category: "Automotriz",
    //   image: "/placeholder.svg?height=100&width=100",
    //   bgColor: "bg-gray-100",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "hol004",
    //   name: "Holdla",
    //   price: 123.0,
    //   category: "Servicios",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "ran005",
    //   name: "Rank",
    //   price: 200.0,
    //   category: "Software",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "reg006",
    //   name: "Regran",
    //   price: 231.0,
    //   category: "Servicios",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "sti007",
    //   name: "Stim",
    //   price: 1231.0,
    //   category: "Electrónicos",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "str008",
    //   name: "String",
    //   price: 234.0,
    //   category: "Materiales",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "tem009",
    //   name: "Temp",
    //   price: 100.0,
    //   category: "Hogar",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
    // {
    //   id: "wra010",
    //   name: "Wrapsa",
    //   price: 2213.0,
    //   category: "Embalaje",
    //   bgColor: "bg-slate-600",
    //   textColor: "text-white",
    //   brand: "",
    //   warehouse: "",
    //   model: "",
    //   sku: "",
    //   barcode: "",
    //   description: ""
    // },
//   ]
// }


// const roleMapping: Record<string, string> = {
//   "ADMIN": ROLES.ADMIN,
//   "CAJERO": ROLES.CAJERO,
//   "USUARIO": ROLES.USER,
//   "PROPIETARIO": ROLES.PROPIETARIO,
//   "ALMACENISTA": ROLES.ALMACENISTA
// }


const checkToken = ()=> {
  const token = localStorage.getItem("token")
  if(!token){
    throw new Error("No token found, cannot fetch users")
  }
  console.log("checkToken: Token found", token)
  return token
}
<<<<<<< HEAD
=======

>>>>>>> 220e9a68c0ae61f3981ff48b5097fd898cdee21c
// function getFallbackProducts(): Product[] {
//   return [

//   {
//     id: "1",
//     name: "Ron Barceló Gran Añejo 750ml",
//     price: 18.99,
//     stock: 120,
//     category: "Ron",
//     brand: "Barceló",
//     warehouse: "Santo Domingo Central",
//     model: "Gran Añejo",
//     sku: "BARC-GA-750",
//     barcode: "8901234500001",
//     description: "Ron dominicano premium añejado en barricas de roble. Ideal para cocteles.",
//     image: "https://example.com/images/barcelo_gran_anejo.jpg",
//     bgColor: "#FAFAFA",
//     textColor: "#333",
//     minStock: 20
//   },
//   {
//     id: "2",
//     name: "Whisky Johnnie Walker Black Label 750ml",
//     price: 39.50,
//     stock: 85,
//     category: "Whisky",
//     brand: "Johnnie Walker",
//     warehouse: "Santiago",
//     model: "Black Label",
//     sku: "JW-BLACK-750",
//     barcode: "8901234500002",
//     description: "Blended Scotch whisky de 12 años, sabor ahumado y suave.",
//     image: "https://example.com/images/jw_black_label.jpg",
//     bgColor: "#000",
//     textColor: "#FFF",
//     minStock: 15
//   },
//   {
//     id: "3",
//     name: "Tequila Don Julio Reposado 700ml",
//     price: 45.99,
//     stock: 60,
//     category: "Tequila",
//     brand: "Don Julio",
//     warehouse: "La Romana",
//     model: "Reposado",
//     sku: "DJ-REP-700",
//     barcode: "8901234500003",
//     description: "Tequila suave con notas de vainilla y caramelo. Reposado por 8 meses.",
//     image: "https://example.com/images/don_julio_reposado.jpg",
//     bgColor: "#FFF7E6",
//     textColor: "#654321",
//     minStock: 10
//   },
//   {
//     id: "4",
//     name: "Vodka Absolut 1L",
//     price: 25.75,
//     stock: 100,
//     category: "Vodka",
//     brand: "Absolut",
//     warehouse: "San Pedro",
//     model: "Original",
//     sku: "ABS-ORG-1L",
//     barcode: "8901234500004",
//     description: "Vodka sueco puro destilado múltiples veces. Perfecto para cocteles.",
//     image: "https://example.com/images/absolut_vodka.jpg",
//     bgColor: "#E0F7FA",
//     textColor: "#000",
//     minStock: 30
//   },
//   {
//     id: "5",
//     name: "Brandy Torres 10 700ml",
//     price: 27.25,
//     stock: 40,
//     category: "Brandy",
//     brand: "Torres",
//     warehouse: "Punta Cana",
//     model: "10 Años",
//     sku: "TORRES-10",
//     barcode: "8901234500005",
//     description: "Brandy español envejecido 10 años. Sabor robusto y suave.",
//     image: "https://example.com/images/torres_10.jpg",
//     bgColor: "#FFF3E0",
//     textColor: "#5D4037",
//     minStock: 12
//   }


//   ]
<<<<<<< HEAD

=======
>>>>>>> 220e9a68c0ae61f3981ff48b5097fd898cdee21c
// }
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