import { PrismaClient } from "@prisma/client";
import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      });
      if (dbUser && session.user) session.user.id = dbUser.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
