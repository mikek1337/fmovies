import UserSideMenu from "@/components/usersidemenu"
import { Toaster } from "sonner"

interface UserLayoutProps{
    children:React.ReactNode
}
export default function UserLayout({children}:UserLayoutProps){
    return(
        <div className="flex gap-2 h-[93%]  ">
            <UserSideMenu/>
            {children}
            <Toaster/>
        </div>
    )
}