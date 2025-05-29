import NextAuth, { type NextAuthConfig } from "next-auth";
import TikTokProvider from "next-auth/providers/tiktok";
import PinterestProvider from "next-auth/providers/pinterest";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { Account, Profile, User } from "next-auth";
import type { AdapterUser } from "@auth/core/adapters";

export const authOptions: NextAuthConfig = {
  providers: [
    TikTokProvider({
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user.info.basic,video.list",
        },
      },
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_APP_ID!,
      clientSecret: process.env.PINTEREST_APP_SECRET!,
      authorization: {
        params: {
          scope: "boards:read,pins:write",
        },
      },
    }),
  ],
  callbacks: {
    async jwt(params: { 
      token: JWT; 
      user?: User | AdapterUser; 
      account?: Account | null; 
      profile?: Profile; 
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: any;
    }) {
      if (params.account) {
        params.token.accessToken = params.account.access_token as string;
        params.token.provider = params.account.provider as string;
      }
      return params.token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.provider) {
        session.provider = token.provider as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler };
export const { auth, signIn, signOut } = handler; 