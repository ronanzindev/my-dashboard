import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Tag, TagInput } from "@/types/tags"
import { createTagDb, getTagsDb } from "@/lib/tag"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cookies from "js-cookie"
import { getUser } from "@/lib/user-db"
import { UserDb } from "@/types/user"
import { ExpenseInput } from "@/types/expenses"
import { registeExpense } from "@/lib/expenses-db"

const AddExpense = () => {
    const [user, setUser] = useState<UserDb>()
    const token = Cookies.get("jwt-token")
    const [tags, setTags] = useState<Tag[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tagData, setTagData] = useState("")
    const navigate = useNavigate()
    const { handleSubmit, register, formState: { errors }, watch } = useForm<ExpenseInput>({defaultValues: {expense_date: new Date()}})
 
    if (!token) {
        navigate("/login")
    }
    const addNewTag = async (tagData: TagInput) => {
        try {
            if (tagData.tag.trim() === "") {
                toast.error("A tag não pode estar vazia")
                return
            }
            const newTag = await createTagDb(tagData)
            setTags((prev) => [...prev, { id: newTag.id, tag: newTag.tag, user_email: newTag.user_email }])
            setIsModalOpen(false)
            toast.success("Tag adicionada com sucesso!")
        } catch (ex) {
            if (ex instanceof Error) {
                toast.error(ex.message)
            } else {
                console.log("Error: ", ex)
                toast.error('Um error aconteceu.Tente novamente mais tarde')
            }
        }

    }
    if (!token) {
        return <>Verificando autenticação...</>;
    }
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userDb = await getUser(token)
                setUser(userDb)
            } catch (ex) {
                if (ex instanceof Error) {
                    toast.error(ex.message)
                } else {
                    console.log("Error: ", ex)
                    toast.error('Um error aconteceu.Tente novamente mais tarde')
                }
            }
        }
        getUserData()
      
    }, [token])
    
    useEffect(() => {
        if(!user) {
            return
        }
        const getTags = async () => {
            try {
                const tagsDb = await getTagsDb(user.email)
                setTags(tagsDb)
            } catch (ex) {
                if (ex instanceof Error) {
                    toast.error(ex.message)
                } else {
                    console.log("Error: ", ex)
                    toast.error('Um error aconteceu.Tente novamente mais tarde')
                }
            }
        }
        getTags()
    }, [user])
    if (!user) {
        return <>Verificando autenticação...</>;
    }
    const submitExpense = async (expenseInput: ExpenseInput) => {
        try {
            expenseInput.user_email = user.email
            await registeExpense(expenseInput)
            toast.success("Gasto salvo com sucesso")
            navigate("/")
        }catch(ex) {
            if (ex instanceof Error) {
                toast.error(ex.message)
            } else {
                console.log("Error: ", ex)
                toast.error('Um error aconteceu.Tente novamente mais tarde')
            }
        }
    }
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="mx-auto max-w-md">
                <CardHeader className="">
                    <CardTitle className="text-2x1 font-bold">
                        Adicionar Gasto
                    </CardTitle>
                    <CardDescription>Por favor preencha os dados do gasto abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submitExpense)} className="">
                        <div className="space-y-4">
                            {/* Valor */}
                            <div className="space-y-2">
                                <Label htmlFor="value">Valor</Label>
                                <Input type="number" step="any" {...register("value", { required: { value: true, message: "Digite o valor do gasto" }, valueAsNumber: true})} />
                                {errors.value && (<p className="text-red-500 text-sm">{errors.value.message}</p>)}
                            </div>
                            {/* Data */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="expense_date">Data do gasto</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-3 text-left font-normal", !watch("expense_date") && "text-muted-foreground")}
                                        >
                                            {watch("expense_date")
                                                ? format(new Date(watch("expense_date")), "PPP", { locale: ptBR })
                                                : <span>Selecione a data</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={watch("expense_date") ? new Date(watch("expense_date")) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const event = { target: { name: "expense_date", value: date.toISOString() } };
                                                    register("expense_date").onChange(event);
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.expense_date && (<p className="text-red-500 text-sm">{errors.expense_date.message}</p>)}
                            </div>
                            {/* Tag */}
                            <div className="space-y-2">
                                <Label htmlFor="tag">Categoria</Label>
                                <Select
                                    onValueChange={(value) => {
                                        const numberValue = Number.parseInt(value)
                                        const event = { target: { name: "tag_id", value: numberValue } };
                                        register("tag_id", {required: {value: true, message: "Escolha uma tag. Se não tiver uma clique em 'Criar Nova Tag'"}}).onChange(event);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {tags.map((tag) => (
                                                <SelectItem key={tag.id} value={tag.id.toString()}>{tag.tag}</SelectItem>
                                            ))}
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>
                                {errors.tag_id && (
                                    <p className="text-red-500 text-sm">{errors.tag_id.message}</p>
                                )}
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-between">
                                <Button onClick={() => navigate("/")} className="w-full bg-red-400">Voltar</Button>
                                <Button type="submit" className="w-full">Salvar</Button>
                            </div>
                        </div>
                    </form>
                    <Button
                        className="mt-4 w-full"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Criar Nova Tag
                    </Button>
                </CardContent>
            </Card>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Criar uma nova tag</DialogTitle>
                        <DialogDescription>Insira o nome da nova tag</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Nome da tag" value={tagData} onChange={(e) => setTagData(e.target.value)} />
                        <div className="flex justify-between space-x-2">
                            <Button variant={"ghost"} onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={() => addNewTag({ tag: tagData, user_email: user.email })}>Salvar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}

export default AddExpense