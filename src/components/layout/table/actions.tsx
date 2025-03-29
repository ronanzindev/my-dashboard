import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Expenses } from "@/types/expenses"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteExpense } from "@/lib/expenses-db"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { Tag } from "@/types/tags"
import { DeleteTag, UpdateTag } from "@/lib/tag"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
interface ExpenseTableActionsProps {
    expense: Expenses
}
export const ExpenseTableActions = ({ expense }: ExpenseTableActionsProps) => {
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const { mutateAsync: DeleteExpenseMutation } = useMutation(
        {
            mutationFn: DeleteExpense,
            onSuccess: () => {
                toast.success("Gasto deletado com sucesso")
                queryClient.invalidateQueries(["expenseManegement"])
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Error ao deletar gasto")
            }
        })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <span className="sr-only">Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Menu:</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/edit-expense/" + expense.id)}>Atualizar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="border hover:bg-red-500  text-red-500"
                    onClick={async () => await DeleteExpenseMutation(expense.id)}
                >
                    Deletar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
interface TagTableActionsProps {
    tag: Tag
}
export const TagTableActions = ({ tag }: TagTableActionsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tagData, setTagData] = useState(tag.tag)
    const queryClient = useQueryClient()
    const { mutateAsync: DeleteTagMutation } = useMutation(
        {
            mutationFn: DeleteTag,
            onSuccess: () => {
                toast.success("Tag deletada com sucesso")
                queryClient.invalidateQueries(["tagsManegement"])
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Error ao deletar tag")
            }
        })
    const { mutateAsync: UpdateTagMutation } = useMutation({
        mutationFn: (data: { id: number; tag: string }) => UpdateTag(data.id, data.tag),
        onSuccess: () => {
            toast.success("Tag atualizada com sucesso")
            queryClient.invalidateQueries(["tagsManegement"])
        },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Error ao deletar tag")
            }
        })
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Menu:</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}>Atualizar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="border hover:bg-red-500  text-red-500"
                        onClick={async () => await DeleteTagMutation(tag.id)}
                    >
                        Deletar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Atualizar tag</DialogTitle>
                        <DialogDescription>Nome da tag</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Nome da tag" defaultValue={tag.tag} value={tagData} onChange={(e) => setTagData(e.target.value)} />
                        <div className="flex justify-between space-x-2">
                            <Button variant={"ghost"} onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={async () => {
                                UpdateTagMutation({id: tag.id, tag: tagData})
                                setIsModalOpen(false)
                            }
                            }>Salvar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}
