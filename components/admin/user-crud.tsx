"use client";

import {
	Edit,
	MoreHorizontal,
	Plus,
	Shield,
	Trash2,
	User,
	UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface UserCRUDProps {
	users: User[];
	onUsersChange: () => void;
}

export function UserCRUD({ users, onUsersChange }: UserCRUDProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user" as "user" | "moderator" | "admin",
	});

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			password: "",
			role: "user",
		});
		setIsCreating(false);
		setEditingUser(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editingUser) {
				// Update user
				const response = await fetch(`/api/admin/users/${editingUser.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: formData.name,
						email: formData.email,
						role: formData.role,
					}),
				});

				if (response.ok) {
					toast.success("User updated successfully");
					onUsersChange();
					resetForm();
				} else {
					const error = await response.json();
					toast.error(error.error || "Failed to update user");
				}
			} else {
				// Create user
				const response = await fetch("/api/admin/users", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (response.ok) {
					toast.success("User created successfully");
					onUsersChange();
					resetForm();
				} else {
					const error = await response.json();
					toast.error(error.error || "Failed to create user");
				}
			}
		} catch (error) {
			console.error("Error saving user:", error);
			toast.error("Error saving user");
		}
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			password: "",
			role: user.role,
		});
		setIsCreating(true);
	};

	const handleDelete = async (userId: string) => {
		if (!confirm("Are you sure you want to delete this user?")) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("User deleted successfully");
				onUsersChange();
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to delete user");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Error deleting user");
		}
	};

	const updateUserRole = async (
		userId: string,
		newRole: "user" | "moderator" | "admin",
	) => {
		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ role: newRole }),
			});

			if (response.ok) {
				toast.success(`User role updated to ${newRole}`);
				onUsersChange();
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to update user role");
			}
		} catch (error) {
			console.error("Error updating user role:", error);
			toast.error("Error updating user role");
		}
	};

	const banUser = async (userId: string) => {
		try {
			const response = await fetch(`/api/admin/users/${userId}/ban`, {
				method: "POST",
			});

			if (response.ok) {
				toast.success("User banned successfully");
				onUsersChange();
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to ban user");
			}
		} catch (error) {
			console.error("Error banning user:", error);
			toast.error("Error banning user");
		}
	};

	const getRoleBadgeVariant = (role: string) => {
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

	const getRoleIcon = (role: string) => {
		switch (role) {
			case "admin":
				return <Shield className="h-4 w-4" />;
			case "moderator":
				return <UserCheck className="h-4 w-4" />;
			case "user":
				return <User className="h-4 w-4" />;
			default:
				return <User className="h-4 w-4" />;
		}
	};

	return (
		<div className="space-y-6">
			{/* Create/Edit Form */}
			{isCreating && (
				<Card>
					<CardHeader>
						<CardTitle>
							{editingUser ? "Edit User" : "Create New User"}
						</CardTitle>
						<CardDescription>
							{editingUser
								? "Update user information"
								: "Add a new user to the system"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
									/>
								</div>
								{!editingUser && (
									<div>
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											type="password"
											value={formData.password}
											onChange={(e) =>
												setFormData({ ...formData, password: e.target.value })
											}
											required
										/>
									</div>
								)}
								<div>
									<Label htmlFor="role">Role</Label>
									<select
										id="role"
										value={formData.role}
										onChange={(e) =>
											setFormData({ ...formData, role: e.target.value as any })
										}
										className="w-full p-2 border rounded-md"
									>
										<option value="user">User</option>
										<option value="moderator">Moderator</option>
										<option value="admin">Admin</option>
									</select>
								</div>
							</div>
							<div className="flex gap-2">
								<Button type="submit">
									{editingUser ? "Update User" : "Create User"}
								</Button>
								<Button type="button" variant="outline" onClick={resetForm}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Users List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Users</CardTitle>
							<CardDescription>
								Manage user accounts, roles, and permissions
							</CardDescription>
						</div>
						<Button onClick={() => setIsCreating(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add User
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{users.map((user) => (
							<div
								key={user.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
										{getRoleIcon(user.role)}
									</div>
									<div>
										<div className="flex items-center space-x-2">
											<h3 className="font-medium">{user.name}</h3>
											<Badge variant={getRoleBadgeVariant(user.role)}>
												{user.role}
											</Badge>
											{user.emailVerified && (
												<Badge variant="outline" className="text-green-600">
													Verified
												</Badge>
											)}
											{user.banned && (
												<Badge variant="destructive">Banned</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
										<p className="text-xs text-muted-foreground">
											Joined {new Date(user.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleEdit(user)}>
											<Edit className="h-4 w-4 mr-2" />
											Edit User
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => updateUserRole(user.id, "user")}
										>
											Set as User
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => updateUserRole(user.id, "moderator")}
										>
											Set as Moderator
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => updateUserRole(user.id, "admin")}
										>
											Set as Admin
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => banUser(user.id)}
											className="text-red-600"
										>
											Ban User
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleDelete(user.id)}
											className="text-red-600"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete User
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))}

						{users.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								No users found
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
