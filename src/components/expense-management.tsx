import { AllExpense } from "@/lib/expenses-db";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DataTable from "./layout/table/data-table";
import { columns } from "./layout/table/columns";
import { LoadingSpinner } from "./load-spinner";

interface ExpenseManegementProps {
    user_email: string
}

const ExpenseManegement = ({user_email}: ExpenseManegementProps) => {
    const {data: expenses, error, isError, isLoading} = useQuery({queryKey: ["expenseManegement", {user_email}], queryFn: () => AllExpense(user_email)})

    if(isError) toast.error(error instanceof Error ? error.message : "Error ao buscar gastos")
    if(isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <LoadingSpinner className="w-16 h-16" />
            </div>
        )
    }
    return (
        <div>
            <DataTable columns={columns} data={expenses!}/>
        </div>
    )
}

export default ExpenseManegement;