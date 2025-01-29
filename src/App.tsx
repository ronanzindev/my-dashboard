import { useNavigate } from "react-router"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Button } from "./components/ui/button"
import { useUser } from "./contexts/user-context"
import Header from "./components/layout/header"
import Finances from "./components/layout/finance"
import ExpenseManegement from "./components/expense-management"
import { LoadingSpinner } from "./components/load-spinner"
import { TagsCharts } from "./components/layout/charts/tags-charts"
function App() {
  const { user } = useUser()
  const navigate = useNavigate()
  if (!user) {
    return  (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner/>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Header */}
        <Header user={user} />
        {/* Main */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/add-expense")}>Adicionar Gasto</Button>
            </div>
          </div>
          <Tabs defaultValue="financas" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financas">Finanças</TabsTrigger>
              <TabsTrigger value="expenses">Gerenciar Gastos</TabsTrigger>
              <TabsTrigger value="chart">Graficos</TabsTrigger>
            </TabsList>
            <TabsContent value="financas">
              <Finances user_email={user.email} />
            </TabsContent>
            <TabsContent value="expenses">
              <ExpenseManegement user_email={user.email} />
            </TabsContent>
            <TabsContent value="chart">
              <TagsCharts user_email={user.email} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
