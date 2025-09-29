"use client";

import {
	BookOpen,
	Bot,
	Command,
	FileText,
	Frame,
	LayoutDashboard,
	LifeBuoy,
	Map,
	PieChart,
	Send,
	Settings2,
	Shield,
	SquareTerminal,
	UserCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const getNavData = (userRole?: string) => {
	const baseNav: Array<{
		title: string;
		url: string;
		icon: any;
		isActive?: boolean;
		items?: Array<{
			title: string;
			url: string;
		}>;
	}> = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Invoices",
			url: "/dashboard/invoices",
			icon: FileText,
		},
		{
			title: "Customers",
			url: "/dashboard/customers",
			icon: UserCheck,
		},
	];

	// Add admin-specific navigation
	if (userRole === "admin") {
		baseNav.push({
			title: "Admin",
			url: "/dashboard/admin",
			isActive: true,
			icon: Shield,
			items: [
				{
					title: "User Management",
					url: "/dashboard/admin",
				},
				{
					title: "Role Management",
					url: "/dashboard/roles",
				},
				{
					title: "Permission Management",
					url: "/dashboard/permissions",
				},
			],
		});
	}

	return {
		navMain: baseNav,
		navSecondary: [
			{
				title: "Support",
				url: "#",
				icon: LifeBuoy,
			},
			{
				title: "Feedback",
				url: "#",
				icon: Send,
			},
		],
		projects: [
			{
				name: "My Projects",
				url: "/projects",
				icon: Frame,
			},
			{
				name: "Analytics",
				url: "/analytics",
				icon: PieChart,
			},
			{
				name: "Reports",
				url: "/reports",
				icon: Map,
			},
		],
	};
};

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user?: {
		name: string;
		email: string;
		image?: string | null;
		role?: string | null;
	};
}) {
	const data = getNavData(user?.role || undefined);

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Better Auth</span>
									<span className="truncate text-xs">Dashboard</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				{user && (
					<NavUser
						user={{
							name: user.name,
							email: user.email,
							image: user.image || undefined,
							role: user.role || undefined,
						}}
					/>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
