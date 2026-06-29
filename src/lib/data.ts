import type { Product, Category, User, DashboardStats } from "../lib/index"

// Mock data for demonstration
export const mockCategories: Category[] = [
  { id: "1", name: "Giovanna" },
  { id: "2", name: "Cristoforo" },
  { id: "3", name: "Elsinore" },
  { id: "4", name: "Norah" },
  { id: "5", name: "Carlota" },
  { id: "6", name: "Rodrigo" },
  { id: "7", name: "Nana" },
  { id: "8", name: "Kerk" },
  { id: "9", name: "Filmer" },
  { id: "10", name: "Kipper" },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Alphazap",
    code: "374162027",
    price: 12341.0,
    cost: 8000.0,
    category: "Giovanna",
    stock: 9,
    minStock: 5,
    unit: "Unidad",
    isActive: true,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Cardify",
    code: "718250175",
    price: 4123.0,
    cost: 2500.0,
    category: "Cristoforo",
    stock: 98,
    minStock: 10,
    unit: "Unidad",
    isActive: true,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Fix San",
    code: "1201400461",
    price: 123124.0,
    cost: 80000.0,
    category: "Elsinore",
    stock: 10,
    minStock: 3,
    unit: "Unidad",
    isActive: true,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Holdlamis",
    code: "2754262785",
    price: 123.0,
    cost: 80.0,
    category: "Norah",
    stock: 99,
    minStock: 20,
    unit: "Unidad",
    isActive: true,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Rank",
    code: "5437869267",
    price: 200.0,
    cost: 120.0,
    category: "Carlota",
    stock: 61,
    minStock: 15,
    unit: "Unidad",
    isActive: true,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockUser: User = {
  id: "1",
  name: "Miguel Santana",
  email: "mg.santana40@hotmail.com",
  role: "admin",
  avatar: "/placeholder.svg?height=40&width=40",
}

export const mockStats: DashboardStats = {
  totalSales: 1,
  totalRevenue: 167096.26,
  totalProfit: 141255.0,
  averageTicket: 167096.26,
  salesCount: 1,
  topProducts: [
    {
      product: mockProducts[2], // Fix San
      totalSold: 1,
      revenue: 123124.0,
    },
  ],
  topCustomers: [
    {
      customer: {
        id: "1",
        name: "HECMANUEL",
        totalPurchases: 167096.26,
      },
      totalSpent: 167096.26,
    },
  ],
  salesByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales: i === 14 ? 1 : 0,
    revenue: i === 14 ? 167096.26 : 0,
  })),
}
