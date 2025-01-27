import supabase from "./supabase"
import { Tag, TagInput } from "@/types/tags"
const TAG_TABLE_NAME = "tags"
const getTagsDb = async (email: string) => {
    const selectedTags = await supabase.from(TAG_TABLE_NAME).select("*").eq("user_email", email)
    if(selectedTags.status !== 200) throw Error("Error ao buscar tags de gasto ") 
    return selectedTags.data as Tag[]
}
const getTagDb = async (tag: string, email: string) => {
    const selectedTags = await supabase.from(TAG_TABLE_NAME).select("id, tag").eq("user_email", email).eq("tag",tag)
    if(selectedTags.status !== 200 || selectedTags.error) throw Error("Error ao buscar tags de gasto ")
    if (selectedTags.data.length === 0) {
        return null
    }
    return selectedTags.data[0]
}
const createTagDb = async (tag: TagInput) => {
    const tagFinded = await getTagDb(tag.tag, tag.user_email)
    if(tagFinded) {
        throw Error("Você já possui uma tag com esse nome")
    }
    const result = await supabase.from(TAG_TABLE_NAME).insert(tag).select()
    if (result.status !== 201 || result.error || result.data.length === 0) throw Error("Error ao criar nova tag")
    return result.data[0] as Tag
}
export {getTagsDb,createTagDb }