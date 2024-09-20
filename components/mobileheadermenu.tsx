import { Film, MenuIcon, Tv } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Gener from "./gener"

const MobileHeaderMenu = ()=>{
    return(
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
            <MenuIcon className="w-6 h-6"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>         
          <DropdownMenuItem>
            <Link href="/home/series" passHref>
            <Tv className="mr-2 h-4 w-4" />
            </Link>
            <span>TV</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Film className="mr-2 h-4 w-4" />
            <span>Movie</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Gener</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <Gener/>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}

export default MobileHeaderMenu;