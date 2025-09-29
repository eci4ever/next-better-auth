import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		// Check if user is admin
		const adminCheck = await requireAdmin()(request);
		if (adminCheck.status !== 200) {
			return adminCheck;
		}

		// Get statistics
		const [
			totalUsers,
			totalAdmins,
			totalModerators,
			totalRegularUsers,
			recentSignups,
		] = await Promise.all([
			prisma.user.count(),
			prisma.user.count({ where: { role: "admin" } }),
			prisma.user.count({ where: { role: "moderator" } }),
			prisma.user.count({ where: { role: "user" } }),
			prisma.user.count({
				where: {
					createdAt: {
						gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
					},
				},
			}),
		]);

		return NextResponse.json({
			totalUsers,
			totalAdmins,
			totalModerators,
			totalRegularUsers,
			recentSignups,
		});
	} catch (error) {
		console.error("Error fetching admin stats:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
