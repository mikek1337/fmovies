import {z} from "zod";

export const SignupSchema = z.object({
    email: z.string().email({message:'Email does not contain @'}),
    password: z.string().min(8, {message:'Password must be greater than 8 characters'}).regex(/^(?=.*[a-z])(?=.*[A-Z])/,{message:"Password must contain lowercase and uppercase characters"}).regex(/^(?=.*[0-9])/, {message:"Password need to have numbers"}).regex(/^(?=.*[!@#\$%\^&])/, {message: "Password must contain at least a special character"}),
    username: z.string().min(4, {message:"Username must be greater than 4 characters"}),
    confirmPassword: z.string()
}).refine(data=>data.password===data.confirmPassword, {path:["confirmPassword"],message:"Passwords do not match"})


export type SignupSchemaType = z.infer<typeof SignupSchema>