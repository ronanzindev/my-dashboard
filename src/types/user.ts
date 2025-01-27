export interface User {
    name: string
    email: string
    password: string
}
export type UserDb = {
    id: number
    created_at: Date
    updated_at: Date
} & User

export type LoginInput = {
    email: string,
    password: string
}