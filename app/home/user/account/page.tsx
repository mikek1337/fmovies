import { updateUser } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

const Page = async () => {
    const session = await getAuthSession()
    const user = await db.user.findFirst({
        where:{
            id: session?.user?.id
        }
    })
    const updateUserWithId = updateUser.bind(null, user?.id!)
    return (
        <div className="border w-full">
            <h1 className="text-3xl font-extrabold">Account</h1>
            <div className="w-full flex items-start justify-center gap-5">
                <form className="max-w-[500px]" action={updateUserWithId}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input type="email" id="email" name="email" disabled defaultValue={user?.email} />
                    </div>
                    <div className="my-1">
                        <label htmlFor="username">Username</label>
                        <Input type="text" id="username" name="username" defaultValue={user?.username}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Input type="password" id="password" name="password"/>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">New Password</label>
                        <Input type="password" id="confirmPassword" name="newPassword"/>
                    </div>
                    <div className="w-full">
                        <Button variant="default" className="w-full">Update</Button>
                    </div>
                </form>
                <div className="">
                    <Avatar className="border w-[100px] h-[100px]">
                        <AvatarImage src={user?.image} alt="user" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}

export default Page;