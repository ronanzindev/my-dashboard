import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitHandler, useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router"
import bcrypt from "bcryptjs-react"
import { registerUser } from "@/lib/user-db"
import { toast } from "react-toastify"
import { useUser } from "@/contexts/user-context"
type RegisterInput = {
    name: string
    email: string,
    password: string
    confirm_password: string
}
const Register = () => {
    const {setUser} = useUser()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>()
    const navigate = useNavigate()
    const onSubmit: SubmitHandler<RegisterInput> = async (data: RegisterInput) => {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(data.password, salt)
            const user = { name: data.name, email: data.email, password: hashedPassword }
            const userDb = await registerUser(user)
            setUser(userDb)
            toast.success("Registro feito com sucesso")
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
            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Registro</CardTitle>
                    <CardDescription>Entre com seus dados para criar sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input {...register("name", { required: true, minLength: {value: 3, message: "O nome deve ter pelo menos 3 letras"} })} id="name" type="text" required />
                                {errors.name && (<p className="text-red-500 text-sm">{errors.name.message}</p>)}
                            </div>
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
                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">Corfirmar senha</Label>
                                <Input
                                    {...register("confirm_password",
                                        {
                                            required: "Confirmação de senha é obrigatória",
                                            minLength: { value: 6, message: "A senha deve conter no minimo 6 caracteres" },
                                            validate: (value) => value === watch("password") || "As senhas não coincidem"

                                        })}
                                    id="confirm_password"
                                    type="password"
                                    required />
                                {errors.confirm_password && (<p className="text-red-500 text-sm">{errors.confirm_password.message}</p>)}
                            </div>
                            <Button className="w-full" type="submit">Registrar</Button>
                            <p>Já tem uma conta?<NavLink to="/register" end>Entre</NavLink ></p>
                        </div>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}
export default Register