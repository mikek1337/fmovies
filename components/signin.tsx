'use client'
import { getCsrfToken, signIn } from "next-auth/react"
import { Button, buttonVariants } from "./ui/button"
import { Input } from "./ui/input"
import { Icons } from "./icons"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {redirect, useRouter, useSearchParams} from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const SignIn = () =>{
    const toast = useToast();
    const router = useRouter();
    const searchParam = useSearchParams();
    const error = searchParam.get("error");
    console.log(error)
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    getCsrfToken().then((token)=>{
        if(token)
            setCsrfToken(token)
    }).catch((error)=>{
        toast.toast({
            title:"Something went wrong",
            description:"Please try again later",
            variant: "destructive"
        });
        redirect('/home');
    });
    return(
        <div className="flex items-center justify-center w-full h-screen bg-indigo-100">
            <div className="max-w-[900px] w-[500px] shadow-md rounded-md bg-white">
                <h3 className="text-2xl font-extrabold text-center my-5 ">SignUp</h3>

                <form  className="p-3" method="post" action="/api/auth/callback/credentials">
                    <div>
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken || ""}/>
                    </div>
                    <div className="my-2">
                        <Input type="text" placeholder="Username" name="username" />
                        
                    </div>
                    <div className="my-2">
                        <Input type="password" placeholder="Password"  name="password"/>
                        
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
                    <p className="text-center text-xs">Already have an account? <span  className={cn(buttonVariants({variant:"link"}),"text-indigo-700 font-semibold cursor-pointer")} onClick={()=>router.push('/signup')}>Signup</span></p>
                </div>
               
            </div>
        </div>
    )
}

export default SignIn;