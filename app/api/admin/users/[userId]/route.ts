import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } },
) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		const { userId } = params;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				emailVerified: true,
				banned: true,
				banReason: true,
				banExpires: true,
			} as any,
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { userId: string } },
) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		const { userId } = params;
		const { name, email, role, banned, banReason, banExpires } =
			await request.json();

		// Validate role if provided
		if (role && !["user", "moderator", "admin"].includes(role)) {
			return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		}

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				...(name && { name }),
				...(email && { email }),
				...(role && { role }),
				...(banned !== undefined && { banned }),
				...(banReason && { banReason }),
				...(banExpires && { banExpires }),
			} as any,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				emailVerified: true,
				banned: true,
				banReason: true,
				banExpires: true,
			} as any,
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { userId: string } },
) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		const { userId } = params;

		// Delete user
		await prisma.user.delete({
			where: { id: userId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
