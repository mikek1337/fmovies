import { Clapperboard, Menu, Tv } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Gener from "./gener"

const MobileHeaderMenu = () => {
    return (
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
            <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-formovies-surface border-white/10 text-white">
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5">
            <Link href="/home/series" className="flex items-center gap-2 w-full">
              <Tv className="size-4 text-formovies-gold" />
              <span>TV Series</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5">
            <Link href="/home/movies" className="flex items-center gap-2 w-full">
              <Clapperboard className="size-4 text-formovies-gold" />
              <span>Movies</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-white/5 focus:bg-white/5 data-[state=open]:bg-white/5">
              <span>Genres</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-formovies-surface border-white/10 text-white">
                <Gener />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}

export default MobileHeaderMenu;
