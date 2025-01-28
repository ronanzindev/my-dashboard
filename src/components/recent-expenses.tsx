import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "react-toastify";
import { GetRecentExpenses } from "@/lib/expenses-db";
import { avatarName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
interface RecentExpensesProps {
  user_email: string
}
export function RecentExpenses({ user_email }: RecentExpensesProps) {
  const { data: recentExpenses, isError, error, isLoading } = useQuery({ queryKey: ["recentExpenses", { user_email }], queryFn: () => GetRecentExpenses(user_email) })
  if (isError) toast.error(error instanceof Error ? error.message : "Error ao buscar gastos mais recentes")
  if (isLoading) {
    return <>Carregando dados...</>
  }
  return (
    <div className="space-y-8">
      {recentExpenses?.map((expense) => (
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