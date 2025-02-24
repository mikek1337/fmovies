'use server'

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db"
import { compareSync, hashSync } from "bcrypt";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

export const sendMessageing = async (roomId:string, message:string)=>{
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
            },
            include:{
                user: true
            }
        });
        
        revalidatePath(`together/${roomId}`);
        
    }
}

export const endRoom = async (roomId:string, mediaId: string)=>{
    const session = await getAuthSession();
    if(session?.user){
        const watchTogether = await db.watchTogether.update({
            where:{
                mediaId_roomId:{
                    roomId: roomId,
                    mediaId: mediaId
                },
                User:{
                    email: session.user.email!
                }
            },
            data:{
                status: 'ENDED'
            }
        });
    }
}

export const updateRoomParticipant = async (roomId:string, mediaId: string)=>{
    const session = await getAuthSession();
    const cookieStore = await cookies();
    if(session?.user){
        const watchTogether = await db.watchTogether.update({
            where:{
                mediaId_roomId:{
                    roomId: roomId,
                    mediaId: mediaId
                },
                status:{
                    not: 'ENDED'
                }
            },
            data:{
                noOfParticipant:{
                    increment: 1
                }
            }
        });
        cookieStore.set('clientId', watchTogether.id);
    }
}

export const leaveRoom = async (roomId:string, mediaId: string)=>{
    const session = await getAuthSession();
    const cookieStore = await cookies();
    if(cookieStore.get('clientId') && session?.user){
        db.watchTogether.update({
            where:{
                mediaId_roomId:{
                    roomId: roomId,
                    mediaId: mediaId
                },
                status:{
                    not: 'ENDED'
                }
            },
            data:{
                noOfParticipant:{
                    decrement: 1
                }
            }
        });
        cookieStore.delete('clientId');
    }
}
