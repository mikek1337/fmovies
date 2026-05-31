import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: true,
      },
      about: {
        type: "string",
        required: false,
        input: false,
      },
      location: {
        type: "string",
        required: false,
        input: false,
      },
      github: {
        type: "string",
        required: false,
        input: false,
      },
      twitter: {
        type: "string",
        required: false,
        input: false,
      },
      linkden: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})

export const getAuthSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
}
