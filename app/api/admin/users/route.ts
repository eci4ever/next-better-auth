import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		// Get all users
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				emailVerified: true,
				banned: true,
				banReason: true,
				banExpires: true,
			} as any,
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		const { name, email, password, role } = await request.json();

		// Validate required fields
		if (!name || !email || !password || !role) {
			return NextResponse.json(
				{ error: "Name, email, password, and role are required" },
				{ status: 400 },
			);
		}

		// Validate role
		if (!["user", "moderator", "admin"].includes(role)) {
			return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		}

		// Create user using Better Auth
		const result = await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
				role,
			},
		});

		if (result.error) {
			return NextResponse.json(
				{ error: result.error.message },
				{ status: 400 },
			);
		}

		return NextResponse.json({ success: true, user: result.data });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
