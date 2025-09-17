import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 2,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
});
