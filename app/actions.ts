'use server'

import { db } from "@/lib/db"
import { compareSync, hashSync } from "bcrypt";
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