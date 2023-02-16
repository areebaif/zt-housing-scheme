import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { OAuthConfig } from "next-auth/providers";
import { GoogleProfile } from "next-auth/providers/google";

type authOptions = {
  providers: OAuthConfig<GoogleProfile>[];
  theme: {
    colorScheme: "light";
  };
};

if (!process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CLIENT_ID)
  throw new Error("provide google id and client secret");

export const authOptions = {
  // Configure one or more authentication providers
  // providers: [
  //   GoogleProvider({
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   }),
  //   // ...add more providers here
  // ],
  // theme: {
  //   colorScheme: "light",
  //   // colorScheme: "auto", // "auto" | "dark" | "light"
  //   // brandColor: "", // Hex color code
  //   // logo: "", // Absolute URL to image
  //   // buttonText: "" // Hex color code
  // },
  pages: {
    signOut: "auth/signout",
  },
};
//export default NextAuth(authOptions);
