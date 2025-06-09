import NextAuth, { type NextAuthConfig } from "next-auth";
import TikTokProvider from "next-auth/providers/tiktok";
import PinterestProvider from "next-auth/providers/pinterest";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { Account, Profile, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    TikTokProvider({
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user.info.basic,video.upload,user.info.profile,user.info.stats,video.list",
        },
      },
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_APP_ID!,
      clientSecret: process.env.PINTEREST_APP_SECRET!,
      authorization: {
        params: {
          scope: "boards:read,boards:write,pins:read,pins:write,user_accounts:read",
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
        // Store provider-specific tokens
        if (params.account.provider === 'tiktok') {
          params.token.tiktokAccessToken = params.account.access_token as string;
        } else if (params.account.provider === 'pinterest') {
          params.token.pinterestAccessToken = params.account.access_token as string;
        }
        params.token.provider = params.account.provider as string;
      }

      if (params.user) {
        params.token.userId = params.user.id;

        // Fetch linked accounts from the database
        const userAccounts = await prisma.account.findMany({
          where: { userId: params.user.id },
        });

        // Add linked account info to the token
        params.token.isTikTokLinked = userAccounts.some(account => account.provider === 'tiktok');
        params.token.isPinterestLinked = userAccounts.some(account => account.provider === 'pinterest');
        
        const tiktokAccount = userAccounts.find(account => account.provider === 'tiktok');
        if(tiktokAccount) { 
          params.token.tiktokAccountId = tiktokAccount.providerAccountId;
          params.token.tiktokAccessToken = tiktokAccount.access_token;
        }

        const pinterestAccount = userAccounts.find(account => account.provider === 'pinterest');
        if(pinterestAccount) { 
          params.token.pinterestAccountId = pinterestAccount.providerAccountId;
          params.token.pinterestAccessToken = pinterestAccount.access_token;
        }
      }

      return params.token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add provider-specific tokens to session
      session.tiktokAccessToken = token.tiktokAccessToken as string | undefined;
      session.pinterestAccessToken = token.pinterestAccessToken as string | undefined;
      session.provider = token.provider as string;
      session.userId = token.userId as string;
      
      // Add linked account info to the session
      session.isTikTokLinked = token.isTikTokLinked as boolean;
      session.isPinterestLinked = token.isPinterestLinked as boolean;
      session.tiktokAccountId = token.tiktokAccountId as string | undefined;
      session.pinterestAccountId = token.pinterestAccountId as string | undefined;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async linkAccount({ user, account, profile }: { user: any, account: any, profile: any }) {
      if (account.provider === "tiktok") {
        try {
          const tiktokUserInfoResponse = await axios.post(
            "https://open.tiktokapis.com/v2/user/info/",
            { 
              fields: ["open_id", "union_id", "avatar_url", "display_name", "username"]
            },
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
                'Content-Type': 'application/json'
              },
            }
          );

          const tiktokUsername = tiktokUserInfoResponse.data.data?.user?.username;
          const tiktokUnionId = tiktokUserInfoResponse.data.data?.user?.union_id;

          if (tiktokUsername || tiktokUnionId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                ...(tiktokUsername && { tiktokUsername }),
                ...(tiktokUnionId && { tiktokUnionId }),
               },
            });
          } else {
             console.error("TikTok username or union_id not found in API response:", tiktokUserInfoResponse.data);
          }

        } catch (error) {
          console.error("Error fetching TikTok user info:", error);
        }
      }
       // We can add similar logic here for Pinterest when we implement it
      // if (account.provider === "pinterest") {
      //   // Fetch Pinterest username or relevant info
      // }
    },
    async createUser({ user }: { user: any }) {
      // The linkAccount event handles the initial linking and setting the username
      // We don't need to do anything specific in createUser for this scenario
    },
  },
};

const handler = NextAuth(authOptions);

export { handler };
export const { handlers, auth, signIn, signOut } = handler; 

declare module "next-auth" {
  interface Session {
    tiktokAccessToken?: string;
    pinterestAccessToken?: string;
    provider?: string;
    userId?: string;
    isTikTokLinked: boolean;
    isPinterestLinked: boolean;
    tiktokAccountId?: string;
    pinterestAccountId?: string;
  }

  interface JWT {
    tiktokAccessToken?: string;
    pinterestAccessToken?: string;
    provider?: string;
    userId?: string;
    isTikTokLinked: boolean;
    isPinterestLinked: boolean;
    tiktokAccountId?: string;
    pinterestAccountId?: string;
  }
} 