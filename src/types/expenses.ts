import { Tag } from "./tags"

export type ExpenseInput = {
    value: number
    expense_date: Date
    tag_id: number
    user_email: string
}

export type ExpenseDataChart = {
    month: string
    total: number
}

export type Expenses = {
    id: number
    value: number
    tags: Tag
}
export type Expense = {
    id: number,
    value: number,
    expense_date: Date,
    tags: Tag,
    user_email: string
}