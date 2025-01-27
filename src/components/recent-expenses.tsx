import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "react-toastify";
import { GetRecentExpenses } from "@/lib/expenses-db";
import { RecentExpenses as RecentExpensesType } from "@/types/expenses";
import { avatarName } from "@/lib/utils";
interface RecentExpensesProps {
  user_email: string
}
export function RecentExpenses({ user_email }: RecentExpensesProps) {
  const [recentExpense, setRecentExpenses] = useState<RecentExpensesType[]>()
  useEffect(() => {
    const getRecentExpenses = async () => {
      try {
        const expenses = await GetRecentExpenses(user_email)
        setRecentExpenses(expenses)
      } catch (ex) {
        if (ex instanceof Error) {
          toast.error(ex.message)
        } else {
          console.log("Error: ", ex)
          toast.error('Um error aconteceu.Tente novamente mais tarde')
        }
      }
    }
    getRecentExpenses()
  }, [user_email])
  return (
    <div className="space-y-8">
      {recentExpense && recentExpense.map((expense) => (
        <div className="flex items-center" key={expense.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{avatarName(expense.tags.tag)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.tags.tag}</p>
          </div>
          <div className="ml-auto font-medium text-red-500">R${expense.value.toFixed(2)}</div>
        </div>
      )
      )}
    </div>
  )
}