import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Banknote, LucideIcon } from "lucide-react";
import ModeToggle from "./mode-toogle";
import NavUser from "./user-nav";
import { UserDb } from "@/types/user";
type Item  = {
    title: string
    url: string
    icon: LucideIcon
}

const items: Array<Item> = [
    {
        title: "Finanças",
        url: "#",
        icon: Banknote
    },
]

type AppSideBarProps = {
    user : UserDb
}

export function AppSideBar({user}: AppSideBarProps

) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>VoxTel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon/>
                                        <span>{item.title}</span>
                                    </a>
                                    
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                    <ModeToggle/>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser  user={user}/>
            </SidebarFooter>
        </Sidebar>
    )
}