import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import MainNav from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { ExpenseChart } from "./components/expenses-chart"
import { RecentExpenses } from "./components/recent-expenses"
import { GetCurrentMonthTotal, GetLastMonthExpensePercentage } from "./lib/expenses-db"
import { useUser } from "./contexts/user-context"
function App() {
  const {user} = useUser()
  const [totalExpense, setTotalExpense] = useState(0)
  const [lastMonthPercentage, setLastMonthPercentage] = useState(0)
  const navigate = useNavigate()
  if(!user) return <>Loading...</>
  useEffect(() => {
    const getTotalExpense = async () => {
      try {
        const total = await GetCurrentMonthTotal(user.email)
        setTotalExpense(total)
        const monthPercentage = await GetLastMonthExpensePercentage(user.email, total)
        setLastMonthPercentage(monthPercentage)
      } catch (ex) {
        if (ex instanceof Error) {
          toast.error(ex.message)
        } else {
          console.log("Error: ", ex)
          toast.error('Um error aconteceu.Tente novamente mais tarde')
        }
      }
    }
    getTotalExpense()
  }, [user])
  return (
    <>
      <div className="hidden flex-col md:flex">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={user}/>
            </div>
          </div>
        </div>
        {/* Main */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/add-expense")}>Adicionar Gasto</Button>
            </div>
          </div>
          <Tabs defaultValue="financas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="financas">Finanças</TabsTrigger>
            </TabsList>
            <TabsContent value="financas">
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
                    <div className="text-2xl font-bold">R${totalExpense.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{lastMonthPercentage.toFixed(2)}%   do ultimo mês</p>
                  </CardContent>
                </Card>
              </div>
              {/* Grafico e Ultimo gastos */}
              <div>
                {/* Grafico */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grafico de gastos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart user_email={user.email} />
                  </CardContent>
                </Card>
                {/* Ultimo gastos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ultimos gastos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentExpenses user_email={user.email}/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
