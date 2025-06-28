"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Auth = () => {
  const session = useSession();
  if (session.data) {
    return (
            <Link href="/home/user" className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={session.data.user?.image || ""}
                  alt={session.data.user?.name || ""}
                />
                <AvatarFallback>{session.data.user?.name}</AvatarFallback>
              </Avatar>
            
            </Link>

    );
  }
  return (
    <>
      <Link className={cn("bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition duration-200 ease-in-out")} href="/signup">
        Signup
      </Link>
      <Link
        className={cn("bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 ease-in-out")}
        href="#"
        onClick={() => signIn()}
      >
        Login
      </Link>
    </>
  );
};

export default Auth;
