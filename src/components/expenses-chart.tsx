import { GetExpenseChart } from "@/lib/expenses-db"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from "recharts"

interface ExpenseChartProps {
  user_email: string
}
export function ExpenseChart({user_email}: ExpenseChartProps) {
    const {data: expenseData, error, isError, isLoading} = useQuery({queryKey: ["expenseData", {user_email}], queryFn: () => GetExpenseChart(user_email)})
    if(isError) toast.error(error instanceof Error ? error.message : "Error ao buscar dados do grafico")
    if(isLoading) {
      return <>Carregando dados...</>
    }
    return (
        <ResponsiveContainer width="100%" height={350}>
          {}
        <BarChart data={expenseData}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={16}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value}`}
          />
           <Tooltip accessibilityLayer={true}/>
          <Bar
            dataKey="total"
            fill="#adfa1d"
            radius={[4, 4, 0, 0]}

          />
        </BarChart>
      </ResponsiveContainer>

    )
}