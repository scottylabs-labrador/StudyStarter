import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth, keycloak } from "better-auth/plugins";
import { headers } from "next/headers";

import { env } from "~/env";
import { db } from "~/server/db";
import { attachPendingBlocks } from "~/server/api/profile";

const baseURL = env.BETTER_AUTH_URL ?? env.SERVER_URL;
const fallbackSecret = "development-secret-change-me-1234567890";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  baseURL,
  secret: env.BETTER_AUTH_SECRET ?? fallbackSecret,
  trustedOrigins: [baseURL],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await attachPendingBlocks(user.id, user.email);
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        keycloak({
          clientId: env.AUTH_CLIENT_ID,
          clientSecret: env.AUTH_CLIENT_SECRET,
          issuer: env.AUTH_ISSUER,
          redirectURI: `${baseURL}/api/auth/oauth2/callback/keycloak`,
        }),
      ],
    }),
  ],
});

export async function getServerSession() {
  return auth.api.getSession({
    headers: headers(),
  });
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  return session;
}
