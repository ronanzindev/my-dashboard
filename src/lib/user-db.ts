import { LoginInput, User, UserDb } from "@/types/user";
import supabase from "./supabase";
import * as jose from 'jose'
import Cookies from "js-cookie"
import bcrypt from "bcryptjs-react"
const privateKey = import.meta.env.VITE_APP_SECRET
const COOKIE_JWT_NAME = "jwt-token"
const COOKIE_JWT_EXPIRES = 30
const USER_TABLE = "users"
const registerUser = async (user: User) => {
    const { data: savedUser, error } = await supabase.from(USER_TABLE).insert(user).select("*").single()
    if (error || !savedUser) {
        if (error?.code == "23505") {
            throw new Error("Email indisponivel, por favor selecione outro")
        }
        throw new Error("Error ao cadastrar usuario")
    }
    const token = await new jose.SignJWT({ id: savedUser.id, email: savedUser.email, name: savedUser.name }).setProtectedHeader(({ alg: "HS256" })).setExpirationTime("30d").sign(new TextEncoder().encode(privateKey))
    setToken(token)
    return savedUser
}

const getUserDb = async (email: string): Promise<UserDb> => {
    const {data: user, error} = await supabase.from(USER_TABLE).select("email, name, password").eq("email", email).returns<UserDb>().single()
    if (error) {
        throw new Error("Usuario não encontrado")
    }
    return user
}
const login = async (userData: LoginInput) => {
    const userDb = await getUserDb(userData.email)
    if(!userDb) throw new Error("Usuario não encontrado")
    if (!await bcrypt.compare(userData.password, userDb.password)) throw Error("Senha invalida")
    const token = await new jose.SignJWT({ id: userDb.id, email: userDb.email, name: userDb.name }).setProtectedHeader(({ alg: "HS256" })).setExpirationTime("30d").sign(new TextEncoder().encode(privateKey))
    setToken(token)
    return userDb
}
const setToken = (token: string) => {
    Cookies.set(COOKIE_JWT_NAME, token, { expires: COOKIE_JWT_EXPIRES })
}
const getUserByToken = async (token: string) => {
    const decodedToken = jose.decodeJwt(token)
    if(!decodedToken.exp) {
        return null
    }
    const currentTime = Math.floor(Date.now() / 1000)
    if(decodedToken.exp < currentTime) {
        return null
    }
    const user = await getUserDb(decodedToken.email as string)
    return user
}
export { registerUser, login, getUserDb, getUserByToken }