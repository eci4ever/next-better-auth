import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import {
	ac,
	admin as adminRole,
	moderator,
	user as userRole,
} from "./permissions";
import { prisma } from "./prisma";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 2,
		autoSignIn: false, // Don't automatically sign in after registration
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [
		nextCookies(),
		admin({
			ac,
			roles: {
				admin: adminRole,
				user: userRole,
				moderator: moderator,
			},
		}),
	],
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email" && (ctx as any).returned?.user) {
				// Assign default role to new users
				await prisma.user.update({
					where: { id: (ctx as any).returned.user.id },
					data: {
						role: "user",
						banned: false,
					} as any,
				});
			}
		}),
	},
});
