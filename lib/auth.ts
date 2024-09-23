import type{NextAuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './db';
import { compareSync } from 'bcrypt';
export const AuthOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers:[
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials){
                const {username, password} = credentials;
                const user = await db.user.findFirst({where:{username}});
                if(user &&  user.password && compareSync(password, user.password)){
                    return user;
                }
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ]
}