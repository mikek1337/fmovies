'use client'
import { SignupSchema, SignupSchemaType } from "@/app/types/signupschema";
import { FC } from "react";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "./ui/input";
import { FadeText } from "./magicui/fade-text";
import { Button, buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const Signup: FC = () => {
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} = useForm<SignupSchemaType>({resolver:zodResolver(SignupSchema)});
    const {isPending, mutate} = useMutation({
        mutationKey:["signup"],
        mutationFn: async (data:SignupSchemaType)=>{
            const res = await fetch('/api/auth/register',{body:JSON.stringify(data), method:"POST"});
            return await res.json();
        },
        onSuccess: (data)=>{
            router.push('/api/auth/signin');
        },
        onError: (error)=>{
            console.log(error)
        }
    }) 
    const submit= (data:SignupSchemaType)=>{
        mutate(data);
    }
    return(
        <div className="flex items-center justify-center w-full h-screen bg-indigo-100">
            <div className="max-w-[900px] w-[500px] shadow-md rounded-md bg-white">
                <h3 className="text-2xl font-extrabold text-center my-5 ">SignUp</h3>

                <form onSubmit={handleSubmit(submit)} className="p-3">
                    <div className="my-2">
                        <Input type="text" placeholder="Email" {...register('email')} />
                        {errors.email && <FadeText text={errors.email.message} className="text-red-500 font-semibold text-xs"/>}
                    </div>
                    <div className="my-2">
                        <Input type="text" placeholder="Username" {...register('username')}/>
                        {errors.username && <FadeText text={errors.username.message} className="text-red-500 font-semibold text-xs"/>}
                    </div>
                    <div className="my-2">
                        <Input type="password" placeholder="Password" {...register('password')}/>
                        {errors.password && <FadeText text={errors.password.message} className="text-red-500 font-semibold text-xs"/>}
                    </div>
                    <div className="my-2">
                        <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')}/>
                        {errors.confirmPassword && <FadeText text={errors.confirmPassword.message} className="text-red-500 font-semibold text-xs"/>}
                    </div>
                    <div className="my-1">
                        <Button variant="outline" type="submit" className="w-full">
                            Signup With Email
                        </Button>
                    </div>
                </form>
                <div className="w-full mx-auto my-1 flex items-center justify-center">
                    <span className="text-zinc-300 text-center text-sm">OR</span>
                </div>
                <div className="my-1 p-1">
                    <Button variant="ghost" onClick={()=>signIn("google")} className="flex items-center gap-2 w-full">
                        <Icons.google className="w-5 h-5"/>
                        Signup with Google
                    </Button>
                </div>

                <div className="my-2">
                    <p className="text-center text-xs">Already have an account? <span  className={cn(buttonVariants({variant:"link"}),"text-indigo-700 font-semibold cursor-pointer")} onClick={()=>signIn()}>Login</span></p>
                </div>
               
            </div>
        </div>
    )
}

export default Signup;