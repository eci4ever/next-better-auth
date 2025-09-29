import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PermissionManagement } from "@/components/admin/permission-management";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PermissionsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const user = session.user;

	// Get user with role
	const userWithRole = await prisma.user.findUnique({
		where: { id: user.id },
		select: {
			role: true,
			banned: true,
			banReason: true,
			banExpires: true,
		} as any,
	});

	const isAdmin = userWithRole && (userWithRole as any).role === "admin";

	if (!isAdmin) {
		redirect("/dashboard");
	}

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Permission Management</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="container mx-auto p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Permission Management</h1>
							<p className="text-muted-foreground">
								Manage system permissions and access controls
							</p>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Permissions</CardTitle>
							<CardDescription>
								Create, edit, and manage system permissions for role-based
								access control
							</CardDescription>
						</CardHeader>
						<CardContent>
							<PermissionManagement />
						</CardContent>
					</Card>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
