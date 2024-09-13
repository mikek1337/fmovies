import { FC } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import Link from "next/link";

const Header:FC = ()=>{
    return(
        <div className="flex items-center gap-4 border">
            <div>
                <h1 className="text-xl font-extrabold">Movies</h1>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Gener</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid grid-cols-4">
                                <li>
                                    <NavigationMenuLink>
                                        <Link href='#'>Horror</Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default Header