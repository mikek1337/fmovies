'use client'
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@prisma/client";
import { XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface UserFormProps{
    userUpdate: (formData: FormData)=>Promise<any>,
    user: User
}
const UserForm:FC<UserFormProps> = ({userUpdate, user})=>{
    const [openPassword, setOpenPassword] = useState(false)
    const update = async(formData:FormData)=>{
        const response = await userUpdate(formData);
        if(response){
            toast("User updated successfully")
        }
    }
    return(
        <>
        <form className="w-full" action={update}>
                <div className="hidden">
                    <label htmlFor="id">ID</label>
                    <Input type="hidden" id="id" name="id" defaultValue={user.id || ""}/>
                </div>
                <div className="hidden">
                    <label htmlFor="image">Image</label>
                    <Input type="hidden" id="image" name="image" defaultValue={user.image || ""}/>
                </div>

                    <div  className="w-full">
                        <label htmlFor="email">Email</label>
                        <Input type="email" id="email" name="email"  defaultValue={user.email || ""} />
                    </div>
                    <div className="my-1 w-full">
                        <label htmlFor="username">Username</label>
                        <Input type="text" id="username" name="username" defaultValue={user.username || ""}/>
                    </div>
                    <div className="my-1 w-full">
                        <label htmlFor="bio">About you</label>
                        <Textarea id="bio" name="bio" defaultValue={user.about || ""} placeholder="Share about your self"/>
                    </div>
                    {
                        !openPassword && (
                            <div className="my-1">
                                <Button variant="outline" onClick={()=>setOpenPassword(true)}>Change Password</Button>
                            </div>

                        )
                    }
                    {
                        openPassword && (
                            <div className="my-1 flex items-center justify-between gap-2">
                                <div className="w-full">
                                    <div className="w-full">
                                        <label htmlFor="password">Password</label>
                                        <Input type="password" id="password" name="password"/>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="confirmPassword">New Password</label>
                                        <Input type="password" id="confirmPassword" name="newPassword"/>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline" onClick={()=>setOpenPassword(false)}><XIcon className="w-5 h-5"/></Button>
                                </div>
                            </div>
                        )
                    }
                    
                    <div className="w-full">
                        <Button variant="default" className="w-full">Update</Button>
                    </div>
                </form>
                 <div className="">
                 <Avatar className="border w-[100px] h-[100px]">
                     <AvatarImage src={user?.image || ""} alt="user" />
                     <AvatarFallback>U</AvatarFallback>
                 </Avatar>
             </div>
             </>
    )
}

export default UserForm;