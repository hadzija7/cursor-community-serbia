import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    error: '/hackathon',
  },
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.email) {
        token.email = profile.email
        token.name = profile.name ?? undefined
        token.picture = (profile as Record<string, unknown>).picture as string | undefined
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string
        session.user.name = (token.name as string) ?? null
        session.user.image = (token.picture as string) ?? null
      }
      return session
    },
  },
})
