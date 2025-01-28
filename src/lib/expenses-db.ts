import {  ExpenseDataChart, ExpenseInput, Expenses } from "@/types/expenses";
import supabase from "./supabase";

const EXPENSE_TABLE = "expenses"
export const RegisteExpense = async (expense: ExpenseInput) => {
    const result = await supabase.from(EXPENSE_TABLE).insert(expense)
    if (result.error || result.status !== 201) {
        throw Error("Error ao salvar gasto!")
    }
}

export const GetExpenseChart = async (user_email: string) => {
    const { data, error } = await supabase.rpc("get_expense_data", { email: user_email }, { get: true }).limit(12)
    if (error) {
        throw new Error("Error ao buscar dados do gastos")
    }
    return data as ExpenseDataChart[]
}

export const GetCurrentMonthTotal = async (user_email: string) => {
    const date = new Date()
    const result = await supabase.from(EXPENSE_TABLE).select("value").eq("user_email", user_email)
        .gte("expense_date", new Date(date.getFullYear(), date.getMonth(), 1).toISOString())
        .lt("expense_date", new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString())
    if (result.error || result.status !== 200) throw Error("Error ao buscar dados do gasto total do mês")
    const totalData = result.data as { value: number }[]
    const total = totalData.reduce((sum, item) => sum + item.value, 0)
    return total
}

export const GetLastMonthExpensePercentage = async (user_email: string, currentMonthTotal: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Define o mês para o anterior
    const anoAnterior = date.getFullYear();
    const mesAnterior = date.getMonth() + 1; // Ajuste, pois `getMonth()` retorna de 0 a 11
    const startDate = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-01`;
    const endDate = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-31`;
    const {data, error, status} = await supabase.from(EXPENSE_TABLE).select("value").eq("user_email", user_email).gte("expense_date", startDate).lte("expense_date", endDate)
    if(status !== 200 || error) {
        throw new Error("Error ao buscar dados do mes anterior")
    }
    const result = data as  {value: number}[]
    if(result.length === 0) return 0
    const lastMonthtotal = result[0].value
    const diff = currentMonthTotal - lastMonthtotal
    const percentage = lastMonthtotal === 0 ? currentMonthTotal * 100 : ((diff / lastMonthtotal) * 100)
    return percentage
}

export const GetRecentExpenses = async (user_email: string) => {
    const {data, error} = await supabase.from(EXPENSE_TABLE).select("id, value, tags(tag)").eq("user_email", user_email).order("expense_date", {ascending: false}).returns<Expenses[]>().limit(5)
    if(error) {
        throw new Error("Error ao buscar dados dos ultimos gastos")
    }
    return data
}

export const AllExpense = async (user_email: string) => {
    const {data, error} = await supabase.from(EXPENSE_TABLE).select("value, id, tags(tag)").eq("user_email", user_email).order("created_at").returns<Expenses[]>()
    if(error) {
        throw new Error("Error ao buscar gastos")
    }
    return data
}

export const DeleteExpense  = async(id:number) => {
    const {error} = await supabase.from(EXPENSE_TABLE).delete().eq("id",id)
    if(error) {
        throw new Error("Error ao deletar gasto")
    }
}

export const UpdateExpense = async(id: number, expense: ExpenseInput) => {
    console.log(expense)
    const {error} = await supabase.from(EXPENSE_TABLE).update(expense).eq("id", id)
    if (error) throw new Error("Erro ao atualizar gasto")
}

export const GetExpenseById = async (id: number) => {
    const {data, error} = await supabase.from(EXPENSE_TABLE).select("value, expense_date, user_email, tag_id").eq("id", id).returns<ExpenseInput>().single()
    if (error) {
        console.log(error.message)
        throw new Error("Erro ao buscar gasto")
    }
    return data as ExpenseInput
}