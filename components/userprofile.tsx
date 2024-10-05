"use client";

import { Camera, Loader, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@prisma/client";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Profile, ProfileType } from "@/app/types/signupschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FadeText } from "./magicui/fade-text";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const session = useSession();
  const { toast } = useToast();
  const { isPending, data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (session.data?.user) {
        const res = await axios.get("/api/user?id=" + "1");
        return res.data as User;
      }
    },
  });
  const {
    register,
    formState: { errors },
  } = useForm<ProfileType>({ resolver: zodResolver(Profile) });
  if (!session.data) return null;
  return (
    <Sheet defaultOpen>
      <SheetTrigger>
        <UserIcon className="w-6 h-6 cursor-pointer rounded-full p-1 hover:shadow-md" />
        Porfile
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          {isPending && <Loader className="w-5 h-5 animate-spin mx-auto" />}
        </SheetDescription>
        <div>
          <div className="relative group mb-10">
            <Avatar className="border mx-auto w-[100px] h-[100px]">
              <AvatarImage
                src={data?.image || ""}
                alt={data?.username || ""}
                width={100}
                height={100}
              />
              <AvatarFallback>{data?.username || ""}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 bg-white/35 ">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <form>
            <div className="my-2">
              <Input type="text" className="hidden" {...register("image")} />
            </div>
            <div className="my-2">
              <Input
                type="text"
                placeholder="Username"
                {...register("username")}
              />
              {errors.username && (
                <FadeText
                  className="text-red-500 font-semibold text-xs"
                  text={errors.username.message || ""}
                />
              )}
            </div>
            <div className="my-2">
              <div className="my-2">
                <Input
                  type="password"
                  placeholder="password"
                  {...register("password")}
                />
                {errors.password && (
                  <FadeText
                    className="text-red-500 font-semibold text-xs"
                    text={errors.password.message || ""}
                  />
                )}
              </div>
              <div className="my-2">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <FadeText
                    className="text-red-500 font-semibold text-xs"
                    text={errors.confirmPassword.message || ""}
                  />
                )}
              </div>
            </div>
            <div className="my-2">
              <Button type="submit" variant="outline" className="w-full">
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
