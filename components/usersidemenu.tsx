"use client"
import { Clock, Film, History, Home, Settings, Tv, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react"

const UserSideMenu:FC = () =>{
    return(
        <aside className="relative w-fit group shadow-md shadow-indigo-100 transition-all duration-300 ease-in-out   rounded-sm group hover:w-[200px]">
            <div className="group-hover:flex items-center gap-2 mt-5 mb-10">
                
            </div>
            <ul className="group-hover:w-auto transition-all duration-100 ease-in-out px-2">
                <li className="h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out  hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                    <Link href="/home/user" className="flex items-center gap-3">
                    <Home className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">Dashbord</span>
                    </Link>
                </li>
                <li className=" h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out  hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                    <Link href="/home" className="flex items-center gap-3">
                        <Film className="w-5 h-5"/>
                        <span className="text-sm hidden group-hover:block">Movies</span>
                    </Link>
                </li>
                <li className=" h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                <Link href="/home" className="flex items-center gap-3">
                    <Tv className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">Series</span>
                </Link>
                </li>
                <li className=" h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                <Link href="/home" className="flex items-center gap-3">
                    <Clock className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">Watch Later</span>
                </Link>
                </li>
                <li className=" h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                <Link href="/home" className="flex items-center gap-3">
                    <History className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">History</span>
                </Link>
                </li>
                <li className=" h-[60px] group-hover:flex items-center gap-3 text-indigo-500 p-2 transition-all duration-200 ease-in-out  hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                <Link href="/home" className="flex items-center gap-3">
                    <Settings className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">Settings</span>
                </Link>
                </li>
                <li className=" h-[60px] w-full absolute bottom-0 group-hover:flex items-center gap-3 transition-all duration-200 ease-in-out text-indigo-500 p-2 hover:bg-indigo-500 hover:rounded-lg hover:text-white">
                <Link href="/home/user/account" className="flex items-center gap-3">
                    <UserCircle2 className="w-5 h-5"/>
                    <span className="text-sm hidden group-hover:block">Account</span>
                </Link>
                </li>
            </ul>

        </aside>
    )
}

export default UserSideMenu;