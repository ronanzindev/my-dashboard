import { useNavigate } from "react-router"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Button } from "./components/ui/button"
import { useUser } from "./contexts/user-context"
import Header from "./components/layout/header"
import Finances from "./components/layout/finance"
import ExpenseManegement from "./components/expense-management"
function App() {
  const { user } = useUser()
  const navigate = useNavigate()
  if (!user) return <>Loading...</>

  return (
    <>
      <div className="hidden flex-col md:flex">
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
            <TabsList>
              <TabsTrigger value="financas">Finanças</TabsTrigger>
              <TabsTrigger value="expenses">Gerenciar Gastos</TabsTrigger>
            </TabsList>
            <TabsContent value="financas">
              <Finances user_email={user.email} />
            </TabsContent>
            <TabsContent value="expenses">
              <ExpenseManegement user_email={user.email} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
