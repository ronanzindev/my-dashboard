import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Expenses } from "@/types/expenses"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteExpense } from "@/lib/expenses-db"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
interface TableActionsProps {
    expense: Expenses
}
const TableActions = ({ expense }: TableActionsProps) => {
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
                <DropdownMenuItem onClick={() => navigate("/edit-expense/"+expense.id)}>Atualizar</DropdownMenuItem>
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

export default TableActions