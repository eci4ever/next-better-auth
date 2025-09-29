import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
		const { role } = await request.json();

		// Validate role
		if (!["user", "moderator", "admin"].includes(role)) {
			return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		}

		// Update user role
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { role },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Error updating user role:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
