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
      <>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Link href="/home/watchlist" className="flex items-center gap-2">
              <Film className="w-5 h-5 " />
              <span className="text-sm">Watch List</span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={session.data.user?.image}
                  alt={session.data.user?.name}
                />
                <AvatarFallback>{session.data.user?.name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <span className="text-sm font-semibold">
                  {session.data.user.username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <UserProfile/>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="md:hidden">
                <Link
                  href="/home/watchlist"
                  className="flex items-center gap-2"
                >
                  <Film className="w-5 h-5 " />
                  <span className="text-sm">Watch List</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/home/watchhistory" className="flex items-center gap-2">
                  <History className="w-5 h-5 " />
                  <span className="text-sm">Watch History</span>
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
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
