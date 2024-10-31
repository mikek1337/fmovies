'use server'

import { db } from "@/lib/db"
import { compareSync, hashSync } from "bcrypt";
import { revalidatePath } from "next/cache";
export async function updateUser(formData: FormData, userId: string) {
    const user = await db.user.findFirst({
        where: {
            id: userId
        }
    });
    if (user) {
        if (formData) {
            let data = {
                email: formData.get('email') as string,
                username: formData.get('username') as string,
                about: formData.get('bio') as string
            }
            console.log(data);
            if (formData.get('password') !== null) {
                const compare = compareSync(formData.get('password') as string, user.password!);
                if (!compare) {
                    return { error: 'Incorrect password' };
                }
                if (formData.get('newPassword') !== null) {
                    const hashPassword = await hashSync(formData.get('newPassword') as string, 10);
                    console.log(hashPassword);
                    data = {
                        ...data,
                    }
                }
            }
            const updatedUser = await db.user.update({
                where: {
                    id: userId
                },
                data: data
            });
            revalidatePath('/home/user/account');
            return updatedUser;
        }
    }
    return { error: 'Bad Request' };

}