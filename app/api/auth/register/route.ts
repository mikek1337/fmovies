import {genSalt, hash} from 'bcrypt';
import {nanoid} from 'nanoid';
import { db } from "@/lib/db";
export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  if(!email || !password || !username){
    return new Response('Missing fields', {status:400});
  }
  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  const user = await db.user.create({
    data:{
        email: email,
        password: hashPassword,
        username: username,
        image: `https://robohash.org/${username}`,
        id: nanoid()
    }
  });
  return new Response(JSON.stringify(user), {status:200});
}