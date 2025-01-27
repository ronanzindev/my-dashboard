import { UserDb } from "@/types/user";
import React, { createContext, useContext, useState } from "react";

interface UserContextType {
    user: UserDb | null,
    setUser: (user: UserDb | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserDb | null>(null)
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