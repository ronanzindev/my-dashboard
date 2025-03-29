import { getTagsDb } from "@/lib/tag"
import { useQuery } from "@tanstack/react-query"
import { LoadingSpinner } from "./load-spinner"
import { toast } from "react-toastify"
import { tagsColumns } from "./layout/table/columns";
import DataTable from "./layout/table/data-table";
interface TagsManagementProps {
    user_email: string
}
const TagsManagement = ({user_email}: TagsManagementProps) => {
    const {data: tags, isError, isLoading, error} = useQuery({queryKey: ["tagsManegement", {user_email}], queryFn: () => getTagsDb(user_email) })
    if (isError) toast.error(error instanceof Error ? error.message : "Error ao buscar todas as tags")
    if (isLoading) {
        return (
          <div className="w-screen h-screen flex items-center justify-center">
            <LoadingSpinner className="w-16 h-16" />
          </div>
        )
      }
    return (
        <DataTable columns={tagsColumns} data={tags!}/>
    )
}

export default TagsManagement