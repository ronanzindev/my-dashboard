import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Expenses } from "@/types/expenses"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import TableActions from "./actions"

export const columns: ColumnDef<Expenses>[] = [
    {
        accessorKey: "tags.tag",
        header: () => <div className="font-bold">Tag</div>
    },
    {
        accessorKey: "value",
        header: () => <div className="font-bold">Valor</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("value"))
            const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        id: "action",
        header: "Ação",
        cell: ({ row }) => {
            const expense = row.original
            return (
              <TableActions expense={expense}/>
            )
        }
    }
]