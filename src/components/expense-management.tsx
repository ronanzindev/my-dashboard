import { AllExpense } from "@/lib/expenses-db";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DataTable from "./layout/table/data-table";
import { columns } from "./layout/table/columns";

interface ExpenseManegementProps {
    user_email: string
}

const ExpenseManegement = ({user_email}: ExpenseManegementProps) => {
    const {data: expenses, error, isError, isLoading} = useQuery({queryKey: ["expenseManegement", {user_email}], queryFn: () => AllExpense(user_email)})

    if(isError) toast.error(error instanceof Error ? error.message : "Error ao buscar gastos")
    if(isLoading) return <>Loading...</>
    return (
        <div>
            <DataTable columns={columns} data={expenses!}/>
        </div>
    )
}

export default ExpenseManegement;