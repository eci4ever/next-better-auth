import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminStats } from "@/components/admin/admin-stats";
import { PermissionManagement } from "@/components/admin/permission-management";
import { RoleManagement } from "@/components/admin/role-management";
import { UserManagement } from "@/components/admin/user-management";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	// Get user with role
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			role: true,
			banned: true,
			banReason: true,
			banExpires: true,
		} as any,
	});

	if (!user || (user as any).role !== "admin") {
		redirect("/dashboard");
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users, roles, and application settings
					</p>
				</div>
			</div>

			<AdminStats />

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>User Management</CardTitle>
						<CardDescription>
							Manage user accounts, roles, and permissions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UserManagement />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Role Management</CardTitle>
						<CardDescription>
							Define and manage user roles and their permissions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RoleManagement />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Permission Management</CardTitle>
						<CardDescription>
							Manage system permissions and access controls
						</CardDescription>
					</CardHeader>
					<CardContent>
						<PermissionManagement />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
