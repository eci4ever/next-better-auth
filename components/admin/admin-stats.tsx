"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface AdminStats {
	totalUsers: number;
	totalAdmins: number;
	totalModerators: number;
	totalRegularUsers: number;
	recentSignups: number;
}

export function AdminStats() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await fetch("/api/admin/stats");
				if (response.ok) {
					const data = await response.json();
					setStats(data);
				}
			} catch (error) {
				console.error("Error fetching admin stats:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Loading...</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">-</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!stats) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-muted-foreground">Failed to load statistics</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Users</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalUsers}</div>
					<p className="text-xs text-muted-foreground">All registered users</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Administrators</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalAdmins}</div>
					<p className="text-xs text-muted-foreground">Users with admin role</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Moderators</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalModerators}</div>
					<p className="text-xs text-muted-foreground">
						Users with moderator role
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Regular Users</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalRegularUsers}</div>
					<p className="text-xs text-muted-foreground">Users with user role</p>
				</CardContent>
			</Card>
		</div>
	);
}
