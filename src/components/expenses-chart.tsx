import { GetExpenseChart } from "@/lib/expenses-db"
import { ExpenseDataChart } from "@/types/expenses"
import { useEffect, useState } from "react"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from "recharts"

interface ExpenseChartProps {
  user_email: string
}
export function ExpenseChart({user_email}: ExpenseChartProps) {
    const [expenseData, setExpenseDate] = useState<ExpenseDataChart[]>()
    useEffect(() => {
      const getChartData = async () => {
        const data = await GetExpenseChart(user_email)
        setExpenseDate(data)
      }
      getChartData()
    }, [])
    if(!expenseData) {
      return <>Carregando dados</>
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