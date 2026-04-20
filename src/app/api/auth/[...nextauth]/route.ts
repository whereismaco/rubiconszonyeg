import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import db from "@/lib/db"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const row = db.prepare("SELECT value FROM settings WHERE key = 'whitelisted_emails'").get() as any;
        const whitelisted = row ? JSON.parse(row.value) : [];
        if (user.email && whitelisted.includes(user.email)) {
          return true;
        }
        return '/portal/login?error=AccessDenied';
      } catch (error) {
        console.error("Auth error:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/portal/login',
    error: '/portal/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }