import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";

export type UserRole = "user" | "moderator" | "admin";

export interface AuthenticatedUser {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}

export async function getAuthenticatedUser(
	request: NextRequest,
): Promise<AuthenticatedUser | null> {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return null;
		}

		// Get user with role from database
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role as UserRole,
		};
	} catch (error) {
		console.error("Error getting authenticated user:", error);
		return null;
	}
}

export function requireRole(allowedRoles: UserRole[]) {
	return async function roleMiddleware(request: NextRequest) {
		const user = await getAuthenticatedUser(request);

		if (!user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 },
			);
		}

		if (!allowedRoles.includes(user.role)) {
			return NextResponse.json(
				{ error: "Insufficient permissions" },
				{ status: 403 },
			);
		}

		return NextResponse.next();
	};
}

export function requireAdmin() {
	return requireRole(["admin"]);
}

export function requireModeratorOrAdmin() {
	return requireRole(["moderator", "admin"]);
}

export function requireUser() {
	return requireRole(["user", "moderator", "admin"]);
}
