import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-middleware";

export async function POST(
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

		// Use Better Auth admin plugin to ban user
		const result = await auth.api.banUser({
			body: {
				userId,
				banReason: "Banned by administrator",
			},
		});

		if (result.error) {
			return NextResponse.json(
				{ error: result.error.message },
				{ status: 400 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error banning user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
