import { getUserByToken } from "@/lib/user-db";
import { UserDb } from "@/types/user";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface UserContextType {
  user: UserDb | null,
  setUser: (user: UserDb | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDb | null>(null)

  const navigate = useNavigate()
  useEffect(() => {
    const checkUser = async () => {
      const token = Cookies.get("jwt-token")
      if (!token) {
        navigate("/login")
        return
      }
      try {
        const userDb = await getUserByToken(token)
        setUser(userDb)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        navigate("/login")
      } finally {

      }
    }
    checkUser()
  }, [navigate])
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) throw new Error("Usuario nao logado")
  return context
}
