'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
export async function updateUser(formData: FormData, userId: string) {
  const user = await db.user.findFirst({
    where: {
      id: userId
    }
  })
  if (user) {
    if (formData) {
      const data: Record<string, string | null> = {}
      const email = formData.get('email') as string
      const name = formData.get('name') as string
      const username = formData.get('username') as string
      const about = formData.get('about') as string
      const location = formData.get('location') as string
      const github = formData.get('github') as string
      const twitter = formData.get('twitter') as string
      const linkden = formData.get('linkden') as string
      if (email) data.email = email
      if (name !== undefined) data.name = name || null
      if (username !== undefined) data.username = username || null
      if (about !== undefined) data.about = about || null
      if (location !== undefined) data.location = location || null
      if (github !== undefined) data.github = github || null
      if (twitter !== undefined) data.twitter = twitter || null
      if (linkden !== undefined) data.linkden = linkden || null

      const updatedUser = await db.user.update({
        where: {
          id: userId
        },
        data
      })
      revalidatePath('/home/user/account')
      return updatedUser
    }
  }
  return { error: 'Bad Request' }
}
