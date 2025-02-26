import type {Chat} from "@prisma/client";

export type ChatResponse = Chat &{
    user:{
        username:string,
        email:string,
        image:string,
    }
}

export type ChatResponseWithoutCreatedAt = Omit<ChatResponse, 'createdAt'>;