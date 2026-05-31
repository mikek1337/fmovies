import { Trending } from "@/lib/tmd";
import { NextResponse } from "next/server";

export async function GET(){
    const data = (await Trending()).data;
    return NextResponse.json(data);
}