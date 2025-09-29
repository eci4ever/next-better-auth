"use client";

import { Edit, Plus, Shield, Trash2, User, UserCheck } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Role {
	name: string;
	permissions: string[];
	description: string;
}

const defaultRoles: Role[] = [
	{
		name: "user",
		permissions: [
			"user:read",
			"user:update",
			"project:create",
			"project:read",
			"project:update",
			"dashboard:read",
		],
		description: "Basic user with limited permissions",
	},
	{
		name: "moderator",
		permissions: [
			"user:read",
			"user:update",
			"project:create",
			"project:read",
			"project:update",
			"project:delete",
			"dashboard:read",
		],
		description: "Moderator with project management permissions",
	},
	{
		name: "admin",
		permissions: [
			"user:read",
			"user:update",
			"project:create",
			"project:read",
			"project:update",
			"project:delete",
			"dashboard:read",
			"admin:read",
			"admin:manageUsers",
			"admin:manageRoles",
			"admin:banUsers",
			"admin:impersonateUsers",
		],
		description: "Full administrative access",
	},
];

const availablePermissions = [
	"user:read",
	"user:update",
	"project:create",
	"project:read",
	"project:update",
	"project:delete",
	"dashboard:read",
	"admin:read",
	"admin:manageUsers",
	"admin:manageRoles",
	"admin:banUsers",
	"admin:impersonateUsers",
];

export function RoleManagement() {
	const [roles, setRoles] = useState<Role[]>(defaultRoles);
	const [isCreating, setIsCreating] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		permissions: [] as string[],
	});

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			permissions: [],
		});
		setIsCreating(false);
		setEditingRole(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (editingRole) {
			// Update role
			setRoles(
				roles.map((role) =>
					role.name === editingRole.name
						? { ...formData, name: formData.name }
						: role,
				),
			);
			toast.success("Role updated successfully");
		} else {
			// Create role
			if (roles.find((r) => r.name === formData.name)) {
				toast.error("Role with this name already exists");
				return;
			}
			setRoles([...roles, formData]);
			toast.success("Role created successfully");
		}

		resetForm();
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		setFormData({
			name: role.name,
			description: role.description,
			permissions: role.permissions,
		});
		setIsCreating(true);
	};

	const handleDelete = (roleName: string) => {
		if (["user", "moderator", "admin"].includes(roleName)) {
			toast.error("Cannot delete default roles");
			return;
		}

		if (confirm("Are you sure you want to delete this role?")) {
			setRoles(roles.filter((role) => role.name !== roleName));
			toast.success("Role deleted successfully");
		}
	};

	const togglePermission = (permission: string) => {
		setFormData((prev) => ({
			...prev,
			permissions: prev.permissions.includes(permission)
				? prev.permissions.filter((p) => p !== permission)
				: [...prev.permissions, permission],
		}));
	};

	const getRoleIcon = (roleName: string) => {
		switch (roleName) {
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

	const getRoleBadgeVariant = (roleName: string) => {
		switch (roleName) {
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

	return (
		<div className="space-y-6">
			{/* Create/Edit Form */}
			{isCreating && (
				<Card>
					<CardHeader>
						<CardTitle>
							{editingRole ? "Edit Role" : "Create New Role"}
						</CardTitle>
						<CardDescription>
							{editingRole
								? "Update role information and permissions"
								: "Define a new role with specific permissions"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Role Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
										disabled={
											editingRole?.name === "user" ||
											editingRole?.name === "moderator" ||
											editingRole?.name === "admin"
										}
									/>
								</div>
								<div>
									<Label htmlFor="description">Description</Label>
									<Input
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										required
									/>
								</div>
							</div>

							<div>
								<Label>Permissions</Label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
									{availablePermissions.map((permission) => (
										<label
											key={permission}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												checked={formData.permissions.includes(permission)}
												onChange={() => togglePermission(permission)}
												className="rounded"
											/>
											<span className="text-sm">{permission}</span>
										</label>
									))}
								</div>
							</div>

							<div className="flex gap-2">
								<Button type="submit">
									{editingRole ? "Update Role" : "Create Role"}
								</Button>
								<Button type="button" variant="outline" onClick={resetForm}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Roles List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Roles</CardTitle>
							<CardDescription>
								Manage user roles and their permissions
							</CardDescription>
						</div>
						<Button onClick={() => setIsCreating(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Role
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{roles.map((role) => (
							<div
								key={role.name}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
										{getRoleIcon(role.name)}
									</div>
									<div>
										<div className="flex items-center space-x-2">
											<h3 className="font-medium capitalize">{role.name}</h3>
											<Badge variant={getRoleBadgeVariant(role.name)}>
												{role.permissions.length} permissions
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{role.description}
										</p>
										<div className="flex flex-wrap gap-1 mt-2">
											{role.permissions.slice(0, 3).map((permission) => (
												<Badge
													key={permission}
													variant="outline"
													className="text-xs"
												>
													{permission}
												</Badge>
											))}
											{role.permissions.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{role.permissions.length - 3} more
												</Badge>
											)}
										</div>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(role)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									{!["user", "moderator", "admin"].includes(role.name) && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDelete(role.name)}
											className="text-red-600 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div>
						))}

						{roles.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								No roles found
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
