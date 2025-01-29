import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"
import { login } from "@/lib/user-db"
import { LoginInput } from "@/types/user"
import { SubmitHandler, useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router"
import {  toast } from "react-toastify"

const Login = () => {
    const { setUser } = useUser()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>()
    const onSubmit: SubmitHandler<LoginInput> = async (userData: LoginInput) => {
        try {
            const userDb = await login(userData)
            setUser(userDb)
            navigate("/")
        } catch (ex) {
            if (ex instanceof Error) {
                toast.error(ex.message)
            } else {
                console.log("Error: ", ex)
                toast.error('Um error aconteceu.Tente novamente mais tarde')
            }
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Entre com seu email e senha para acessar sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input {...register("email", { required: true, pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Insira um email valido" } })} id="email" type="email" placeholder="email@example.com" required />
                                {errors.email && (<p className="text-red-500 text-sm">{errors.email.message}</p>)}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input {...register("password", { required: "A senha é obrigatória", minLength: { value: 6, message: "A senha deve conter no minimo 6 caracteres" } })} id="password" type="password" required />
                                {errors.password && (<p className="text-red-500 text-sm">{errors.password.message}</p>)}

                            </div>
                            <Button className="w-full" type="submit">Login</Button>
                            <p>Ainda não tem uma conta? <NavLink to="/register" end>Registre-se</NavLink ></p>
                        </div>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}
export default Login