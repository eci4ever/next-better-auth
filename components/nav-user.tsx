"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Shield,
	Sparkles,
	User,
	UserCheck,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import SignOutButton from "./ui/signout-button";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		image?: string | null;
		role?: string;
	};
}) {
	const { isMobile } = useSidebar();

	const getRoleIcon = (role?: string) => {
		switch (role) {
			case "admin":
				return <Shield className="h-3 w-3" />;
			case "moderator":
				return <UserCheck className="h-3 w-3" />;
			case "user":
				return <User className="h-3 w-3" />;
			default:
				return <User className="h-3 w-3" />;
		}
	};

	const getRoleBadgeVariant = (role?: string) => {
		switch (role) {
			case "admin":
				return "destructive";
			case "moderator":
				return "default";
			case "user":
				return "secondary";
			default:
				return "outline";
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.image || undefined} alt={user.name} />
								<AvatarFallback className="rounded-lg">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<div className="flex items-center gap-1">
									<span className="truncate text-xs">{user.email}</span>
									{user.role && (
										<Badge
											variant={getRoleBadgeVariant(user.role)}
											className="text-xs px-1 py-0"
										>
											{getRoleIcon(user.role)}
											<span className="ml-1">{user.role}</span>
										</Badge>
									)}
								</div>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image || undefined} alt={user.name} />
									<AvatarFallback className="rounded-lg">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<div className="flex items-center gap-1">
										<span className="truncate text-xs">{user.email}</span>
										{user.role && (
											<Badge
												variant={getRoleBadgeVariant(user.role)}
												className="text-xs px-1 py-0"
											>
												{getRoleIcon(user.role)}
												<span className="ml-1">{user.role}</span>
											</Badge>
										)}
									</div>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={(e) => e.preventDefault()}>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={(e) => e.preventDefault()}>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem onClick={(e) => e.preventDefault()}>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem onClick={(e) => e.preventDefault()}>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut />
							<SignOutButton />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
