import { createContext, useContext, useState, type ReactNode } from "react"

export type UserProfile = {
  fullname: string
  email: string
  avatar: string
}

type UserContextType = {
  customerName: string
  setCustomerName: (name: string) => void
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [customerName, setCustomerName] = useState("HECMANUEL")
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullname: "",
    email: "",
    avatar: "",
   
  })

  return (
    <UserContext.Provider
      value={{
        customerName,
        setCustomerName,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
