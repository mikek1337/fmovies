'use server'

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateUser(formData: FormData, userId: string) {
  const session = await getAuthSession()
  if (!session?.user?.id || session.user.id !== userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findFirst({
    where: {
      id: userId
    }
  })

  if (user && formData) {
    const data: Record<string, string | null> = {}
    const name = formData.get('name') as string | null
    const username = formData.get('username') as string | null
    const about = formData.get('about') as string | null
    const location = formData.get('location') as string | null
    const github = formData.get('github') as string | null
    const twitter = formData.get('twitter') as string | null
    const linkden = formData.get('linkden') as string | null

    if (name !== null) data.name = name.trim() || null
    if (username !== null) data.username = username.trim() || null
    if (about !== null) data.about = about.trim() || null
    if (location !== null) data.location = location.trim() || null
    if (github !== null) data.github = github.trim() || null
    if (twitter !== null) data.twitter = twitter.trim() || null
    if (linkden !== null) data.linkden = linkden.trim() || null

    const updatedUser = await db.user.update({
      where: {
        id: userId
      },
      data
    })
    revalidatePath('/home/user/account')
    return updatedUser
  }

  return { error: 'Bad Request' }
}
