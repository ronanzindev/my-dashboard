export type Tag = {
    tag: string
    id: number
    user_email: string
}

export type TagInput = {
    tag: string
    user_email: string
}

export type TagsExpense = {
    id: number,
    tag: string,
    total: number
}