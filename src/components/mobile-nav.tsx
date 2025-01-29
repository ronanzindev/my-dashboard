import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useNavigate } from "react-router";

export function MobileNav() {
    const navigate = useNavigate()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="lg:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                    <Button variant={"ghost"} onClick={() => navigate("/")}>
                        Dashboard
                    </Button>
                    <Button variant={"ghost"} onClick={() => navigate("/add-expense")}>
                        Adicionar Gasto
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}