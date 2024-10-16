import { FC } from "react";

interface UserDashboardProps{
    userSession:{
        name:string,
        email:string,
        image:string
    },
    children:React.ReactNode
}
const UserDashboard:FC<UserDashboardProps> = ({userSession, children}) =>{
    return (
        <div>
            <h1 className="md:text-4xl text-2xl font-extrabold">Welcome, {userSession.name}</h1>
            {children}
        </div>
    )
}

export default UserDashboard;