import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { findUserByEmail, verifyPassword, isLocked } from "@/lib/userStore";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials as { email: string; password: string };
        const user = findUserByEmail(email);
        if (!user) {
          throw new Error('INVALID_CREDENTIALS');
        }
        if (isLocked(email)) {
          throw new Error('ACCOUNT_LOCKED');
        }
        const ok = await verifyPassword(email, password);
        if (ok === true) {
          return { id: user.id, name: user.name, email: user.email };
        }
        // verifyPassword increments failed attempts when needed
        throw new Error('INVALID_CREDENTIALS');
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: { scope: 'read:user user:email' },
      },
    }),
  ],
  pages: {
    signIn: '/signIn',
  },
  session: {
    strategy: 'jwt' as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };