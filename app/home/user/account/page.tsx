import { updateUser } from "@/app/actions";
import UserForm from "@/components/userform";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {redirect} from "next/navigation";
const Page = async () => {
    const session = await getAuthSession()
    
    if(!session){
        redirect("/login")
    }  
    const user = await db.user.findFirst({
        where:{
            email: session?.user?.email
        }
    })
    const updateUserWithId = async (formData: FormData)=>{
        "use server"
        if (user?.id) {
            return  await updateUser(formData, user.id);
        }
        return undefined;
    }
    return (
        <div className="border w-full p-3">
            <h1 className="text-3xl font-extrabold">Account</h1>
            <div className="w-full flex items-start justify-between gap-5 my-10">
                <UserForm userUpdate={updateUserWithId} user={user}/>
            </div>
        </div>
    )
}

export default Page;