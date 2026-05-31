import { updateUser } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {redirect} from "next/navigation";
import { Globe, Hash, Github, Linkedin, MapPin, Twitter } from "lucide-react";

const Page = async () => {
    const session = await getAuthSession()
    if(!session || !session.user){
        redirect('/login')
    }
    
    const user = await db.user.findFirst({
        where:{
            email: session.user.email!
        }
    })
    if(!user){
        redirect('/login')
    }

    const updateUserWithId = async (formData: FormData) => {
        "use server"
        updateUser(formData, user!.id)
    }

    const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1 h-8 bg-formovies-gold rounded-full" />
                <h1 className="font-display text-4xl tracking-wider text-white">Settings</h1>
            </div>

            <form action={updateUserWithId}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="formovies-card !bg-white/[0.03] !border-white/10 !backdrop-blur-sm border-0">
                            <CardHeader className="text-center pb-4">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="size-24 ring-2 ring-formovies-gold/30 ring-offset-2 ring-offset-formovies-dark">
                                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                        <AvatarFallback className="bg-formovies-gold/10 text-formovies-gold font-display text-2xl">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="font-display text-2xl text-white tracking-wider">
                                    {user.name || "Anonymous"}
                                </CardTitle>
                                <CardDescription className="text-white/40 text-sm">
                                    @{user.username || "no-username"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        Display Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={user.name || ""}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        defaultValue={user.username || ""}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="about" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        Bio
                                    </label>
                                    <Textarea
                                        id="about"
                                        name="about"
                                        rows={4}
                                        defaultValue={user.about || ""}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50 resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Account Card */}
                        <Card className="formovies-card !bg-white/[0.03] !border-white/10 !backdrop-blur-sm border-0">
                            <CardHeader>
                                <CardTitle className="font-display text-xl tracking-wider text-white flex items-center gap-3">
                                    <Hash className="size-4 text-formovies-gold" />
                                    Account
                                </CardTitle>
                                <CardDescription className="text-white/40 text-sm">
                                    Manage your email and password
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        disabled
                                        defaultValue={user.email || ""}
                                        className="bg-white/5 border-white/10 text-white/60 placeholder:text-white/20 cursor-not-allowed"
                                    />
                                    <p className="text-[11px] text-white/30 mt-1">Email cannot be changed</p>
                                </div>
                                <div className="rounded-lg bg-formovies-gold/[0.04] border border-formovies-gold/10 p-4">
                                    <p className="text-xs text-white/50">
                                        Password changes are handled through your account provider. 
                                        Use the <span className="text-formovies-gold">Forgot Password</span> flow on the sign-in page.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links Card */}
                        <Card className="formovies-card !bg-white/[0.03] !border-white/10 !backdrop-blur-sm border-0">
                            <CardHeader>
                                <CardTitle className="font-display text-xl tracking-wider text-white flex items-center gap-3">
                                    <Globe className="size-4 text-formovies-gold" />
                                    Social Links
                                </CardTitle>
                                <CardDescription className="text-white/40 text-sm">
                                    Connect your social profiles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <div>
                                    <label htmlFor="location" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                        <Input
                                            id="location"
                                            name="location"
                                            defaultValue={user.location || ""}
                                            placeholder="Where are you based?"
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="github" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                            GitHub
                                        </label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                            <Input
                                                id="github"
                                                name="github"
                                                defaultValue={user.github || ""}
                                                placeholder="username"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="twitter" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                            Twitter
                                        </label>
                                        <div className="relative">
                                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                            <Input
                                                id="twitter"
                                                name="twitter"
                                                defaultValue={user.twitter || ""}
                                                placeholder="@username"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="linkden" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                                        LinkedIn
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                                        <Input
                                            id="linkden"
                                            name="linkden"
                                            defaultValue={user.linkden || ""}
                                            placeholder="URL or username"
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        type="submit"
                        className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold min-w-[200px]"
                    >
                        Save All Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Page;