'use server'

import { db } from "@/lib/db"
import { compareSync, hashSync } from "bcrypt";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
export async function updateUser(formData:FormData, userId:string){
    const user = await db.user.findFirst({
        where:{
            id:userId
        }
    });
    if(user){
    if(formData){
    const compare = compareSync(formData.get('password') as string, user.password!);
    let data = {
        email:formData.get('email') as string,
        username:formData.get('username') as string,
    }
    if(!compare){
        return {error:'Incorrect password'};
    }
    if(formData.get('newPassword') !== null){
        const hashPassword = await hashSync(formData.get('newPassword') as string, 10);
        console.log(hashPassword);
        data = {
            ...data,
            
        }
    }
    const updatedUser = await db.user.update({
        where:{
            id:userId
        },
        data:data
    });
    revalidatePath('/api/auth/session');
    revalidatePath('/home/user/account');
    return updatedUser;
}
}
return {error:'Bad Request'};

}

export const sendMessage = async (roomId:string, message:string)=>{
    const session = await getServerSession();
    if(session?.user){
        const chat = await db.chat.create({
            data:{
                user:{
                    connect:{
                        email: session.user.email!
                    },
                },
                roomId: roomId,
                message:message,
                createdAt: new Date(),
                id:nanoid()
            }
        });
        if(chat) return true;
        return false;
        
    }
}