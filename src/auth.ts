import NextAuth from "next-auth";
import TikTok from "next-auth/providers/tiktok";
import Pinterest from "next-auth/providers/pinterest";
import Discord from "next-auth/providers/discord";

export const { auth, handlers } = NextAuth({
  providers: [
    TikTok({
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user.info.basic,video.list",
        },
      },
    }),
    Pinterest({
      clientId: process.env.PINTEREST_APP_ID!,
      clientSecret: process.env.PINTEREST_APP_SECRET!,
      authorization: {
        params: {
          scope: "boards:read,pins:write",
        },
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
        token.provider = account.provider as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.provider) {
        session.provider = token.provider as string;
      }
      // Add userId to session from token
      if (token.sub) {
        session.userId = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
