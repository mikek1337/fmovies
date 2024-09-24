import {z} from "zod";

export const SignupSchema = z.object({
    email: z.string().email({message:'Email does not contain @'}),
    username: z.string().min(4, {message:"Username must be greater than 4 characters"}),
    password: z.string().min(8, {message:'Password must be greater than 8 characters'}).regex(/^(?=.*[a-z])(?=.*[A-Z])/,{message:"Password must contain lowercase and uppercase characters"}).regex(/^(?=.*[0-9])/, {message:"Password need to have numbers"}).regex(/^(?=.*[!@#\$%\^&])/, {message: "Password must contain at least a special character"}),
    confirmPassword: z.string()
}).refine(data=>data.password===data.confirmPassword, {path:["confirmPassword"],message:"Passwords do not match"})

export const Profile = z.object({
    username: z.string().min(4, {message:"Username must be greater than 4 characters"}),
    image:z.string().url({message: "Please upload image"}),
    password: z.string().min(8, {message:'Password must be greater than 8 characters'}).regex(/^(?=.*[a-z])(?=.*[A-Z])/,{message:"Password must contain lowercase and uppercase characters"}).regex(/^(?=.*[0-9])/, {message:"Password need to have numbers"}).regex(/^(?=.*[!@#\$%\^&])/, {message: "Password must contain at least a special character"}),
    confirmPassword: z.string()
}).refine(data=>data.password===data.confirmPassword, {path:["confirmPassword"],message:"Passwords do not match"})


export type SignupSchemaType = z.infer<typeof SignupSchema>

export type ProfileType = z.infer<typeof Profile>