"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Film, History, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserProfile from "./userprofile";

const Auth = () => {
  const session = useSession();
  if (session.data) {
    return (
            <Link href="/home/user" className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={session.data.user?.image}
                  alt={session.data.user?.name}
                />
                <AvatarFallback>{session.data.user?.name}</AvatarFallback>
              </Avatar>
              <span>{session.data.user?.username}</span>
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
