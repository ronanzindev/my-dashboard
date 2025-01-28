import { UserDb } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface UserContextType {
    user: UserDb | null,
    setUser: (user: UserDb | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserDb | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        if(!user) navigate("/login")
    }, [user, navigate])
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () : UserContextType => {
    const context = useContext(UserContext)
    if(!context) throw new Error("Usuario nao logado")
    return context
}