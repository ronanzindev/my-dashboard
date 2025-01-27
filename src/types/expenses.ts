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

export type RecentExpenses = {
    id: number
    value: number
    tags: Tag
}