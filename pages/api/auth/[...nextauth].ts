import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { SessionStrategy } from "next-auth";
import { prisma } from "@/db/prisma";
//import { User } from "@prisma/client";
import { User } from "next-auth";

if (
  !process.env.EMAIL_SERVER_HOST ||
  !process.env.EMAIL_SERVER_PORT ||
  !process.env.EMAIL_SERVER_USER ||
  !process.env.EMAIL_SERVER_PASSWORD ||
  !process.env.EMAIL_FROM
) {
  throw new Error("no environemnt variables exit");
}
// TODO: create a callback function for signin and check authorize email that way

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as SessionStrategy,
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn(props: { user: any }) {
      const { user } = props;
      if (!user.verifiedUser) {
        return false;
      }
      return true;
    },
    async jwt(props: { token: any; user?: any; isNewUser?: boolean }) {
      const { token, user, isNewUser } = props;
      console.log(token, user, isNewUser, "jwt");
      return token;
    },
  },
  providers: [
    EmailProvider({
      // type: "email",
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
};
export default NextAuth(authOptions);
