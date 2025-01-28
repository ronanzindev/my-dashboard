import { useQuery } from "@tanstack/react-query"
import { ExpenseChart } from "../expenses-chart"
import { RecentExpenses } from "../recent-expenses"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { toast } from "react-toastify"
import { GetCurrentMonthTotal, GetLastMonthExpensePercentage } from "@/lib/expenses-db"
interface FinacesProps {
    user_email: string
}
const Finances = ({ user_email }: FinacesProps) => {
    const { data: total, isError: isTotalError, error: totalError } = useQuery({ queryKey: ["currentMonthTotal", { user_email}], queryFn: async () => GetCurrentMonthTotal(user_email) })
    const { data: lastMonthPercentage, isError: isLastMonthPercentageError, error: lastMonthPercentageError } = useQuery({ queryKey: ["lastMonthPercentage", { user_email, total }], queryFn: async () => await GetLastMonthExpensePercentage(user_email, total!), enabled: total !== undefined })

  if (isLastMonthPercentageError) {
    toast.error(lastMonthPercentageError instanceof Error ? lastMonthPercentageError.message : "Error ao buscar dados de porcentagem do ultimo mes")
  }

    if (isTotalError) {
        toast.error(totalError instanceof Error ? totalError.message : "Error ao buscar o valor total gasto do mes")
    }
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R${total ? total.toFixed(2) : "Carregando..."}</div>
                        <p className="text-xs text-muted-foreground">{lastMonthPercentage ? lastMonthPercentage.toFixed(2) : "Carregando..."}%   do ultimo mês</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                {/* Grafico */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grafico de gastos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExpenseChart user_email={user_email} />
                    </CardContent>
                </Card>
                {/* Ultimo gastos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ultimos gastos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentExpenses user_email={user_email} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Finances