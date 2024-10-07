import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest){
    return NextResponse.redirect(new URL(`signup/${req.url}`));
}

export const config = {
    matcher: '/home/user/:path',
}