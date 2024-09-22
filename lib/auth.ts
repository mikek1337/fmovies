import type{NextAuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
export const AuthOptions:NextAuthOptions = {
    providers:[
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials){
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ]
}