
import { FC } from "react";
import {signIn, useSession} from "next-auth/react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";
import Gener from "./gener";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Film, Play } from "lucide-react";

import SearchDialog from "./searchdialog";
import MobileHeaderMenu from "./mobileheadermenu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Auth from "./auth";
import UserProfile from "./userprofile";

const Header: FC = () => {
  return (
    <div className="flex items-center justify-between border p-3 w-screen md:w-auto">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="block md:hidden">
            <MobileHeaderMenu/>
          </div>
            <Play className="md:w-10 md:h-10 w-5 h-5 fill-indigo-900 text-indigo-900 "/>
            <Link href='/home'>
            <h1 className="md:text-3xl text-xl font-extrabold text-indigo-700">Movies</h1>
          </Link>
        </div>
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Geners</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <Gener />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/home/series" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    TV
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Movies
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <UserProfile/>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <SearchDialog/>
        <Auth/>
      </div>
    </div>
  );
};

export default Header;
