import { cn } from "@/lib/utils"
import React from "react"

const MainNav = ({className}: React.HTMLAttributes<HTMLElement>) => {
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            <a className="text-sm  font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
        </nav>
    )
}
export default MainNav