"use client";

import { useEffect, useState } from "react";
import { UserCRUD } from "./user-crud";

interface User {
	id: string;
	name: string;
	email: string;
	role: "user" | "moderator" | "admin";
	createdAt: string;
	emailVerified: boolean;
	banned?: boolean;
	banReason?: string;
	banExpires?: string;
}

export function UserManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("/api/admin/users");
			if (response.ok) {
				const data = await response.json();
				setUsers(data);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="flex items-center space-x-4 p-4 border rounded-lg"
					>
						<div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
						<div className="space-y-2 flex-1">
							<div className="h-4 bg-muted rounded animate-pulse" />
							<div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return <UserCRUD users={users} onUsersChange={fetchUsers} />;
}
