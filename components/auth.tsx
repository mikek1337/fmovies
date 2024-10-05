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
              <span>{session.data.user?.name}</span>
            </Link>

    );
  }
  return (
    <>
      <Link className={cn(buttonVariants({ variant: "ghost" }))} href="/signup">
        Signup
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "default" }))}
        href="#"
        onClick={() => signIn()}
      >
        Login
      </Link>
    </>
  );
};

export default Auth;
