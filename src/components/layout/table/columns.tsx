import { Expense } from "@/types/expenses"
import { ColumnDef } from "@tanstack/react-table"
import {ExpenseTableActions, TagTableActions} from "./actions"
import { Tag } from "@/types/tags"

export const expenseColumns: ColumnDef<Expense>[] = [
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
        accessorKey: "expense_date",
        header: "Data",
        cell: ({row}) => {
            const date = new Date(row.getValue("expense_date"))
            const formatted = date.toLocaleDateString("pt-BR")
            return <div>{formatted}</div>
        }
    },
    {
        id: "action",
        header: "Ação",
        cell: ({ row }) => {
            const expense = row.original
            return (
              <ExpenseTableActions expense={expense}/>
            )
        }
    }
]
export const tagsColumns: ColumnDef<Tag>[] = [
    {
        accessorKey: "tag",
        header: () => <div className="font-bold">Nome</div>
    },
    {
        id: "action",
        header: "Ação",
        cell: ({ row }) => {
            const tag = row.original
            return (
              <TagTableActions tag={tag}/>
            )
        }
    }
]