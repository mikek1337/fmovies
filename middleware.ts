import { NextResponse } from "next/server";
import type {NextRequest } from "next/server";
import { getAuthSession } from "./lib/auth";
export async function middleware(req:NextRequest){
    return NextResponse.next();
}

