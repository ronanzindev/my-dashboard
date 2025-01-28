import { UserDb } from "@/types/user"
import MainNav from "../main-nav"
import { UserNav } from "../user-nav"
import ModeToggle from "../mode-toogle"

interface HeaderProps  {
    user: UserDb
}
const Header =  ({user}: HeaderProps) => {
    return (
    <div className="top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
        <nav className="h-14 flex items-center justify-between px-4">
            <div className="hidden lg:block">
                <MainNav className="mx-6"/>
            </div>
            <div className="flex items-center gap-2">
                <ModeToggle />
                <UserNav user={user}/>
            </div>
        </nav>
    </div>
    )

}

export default Header