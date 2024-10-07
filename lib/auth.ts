import{getServerSession, type NextAuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import { compareSync } from 'bcrypt';
import { nanoid } from 'nanoid';
import { url } from 'inspector';
export const AuthOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session:{
        strategy: 'jwt',
    },
    providers:[
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials){
                if(credentials){
                const user = await db.user.findFirst({where:{username:credentials.username}});
                if(user &&  user.password && compareSync(credentials.password, user.password)){
                    return user;
                }
            }
                return null
            },
            
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
            
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user = {
                    ...session.user,
                    name: token.name,
                    email: token.email,
                    image: token.picture,
                };
            }
        
            return session;
        },
        redirect: async({url, baseUrl})=>{
            if(url)
                return baseUrl + url;
            return baseUrl
        },

        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email,
                },
            })

            if (!dbUser) {
                token.id = user!.id
                return token
            }

            if (!dbUser.username) {
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(10),
                    },
                })
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
            }
        }
        },
}
export const getAuthSession = () => getServerSession(AuthOptions)