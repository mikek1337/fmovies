import UserSideMenu from "@/components/usersidemenu"

interface UserLayoutProps{
    children:React.ReactNode
}
export default function UserLayout({children}:UserLayoutProps){
    return(
        <div className="flex gap-2 h-[93%]  ">
            <UserSideMenu/>
            {children}
        </div>
    )
}