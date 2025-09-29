"use client";

import { Edit, Key, Plus, Trash2 } from "lucide-react";
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

interface Permission {
	name: string;
	description: string;
	resource: string;
	action: string;
}

const defaultPermissions: Permission[] = [
	{
		name: "user:read",
		description: "Read user information",
		resource: "user",
		action: "read",
	},
	{
		name: "user:update",
		description: "Update user information",
		resource: "user",
		action: "update",
	},
	{
		name: "project:create",
		description: "Create new projects",
		resource: "project",
		action: "create",
	},
	{
		name: "project:read",
		description: "Read project information",
		resource: "project",
		action: "read",
	},
	{
		name: "project:update",
		description: "Update project information",
		resource: "project",
		action: "update",
	},
	{
		name: "project:delete",
		description: "Delete projects",
		resource: "project",
		action: "delete",
	},
	{
		name: "dashboard:read",
		description: "Access dashboard",
		resource: "dashboard",
		action: "read",
	},
	{
		name: "admin:read",
		description: "Read admin information",
		resource: "admin",
		action: "read",
	},
	{
		name: "admin:manageUsers",
		description: "Manage user accounts",
		resource: "admin",
		action: "manageUsers",
	},
	{
		name: "admin:manageRoles",
		description: "Manage user roles",
		resource: "admin",
		action: "manageRoles",
	},
	{
		name: "admin:banUsers",
		description: "Ban and unban users",
		resource: "admin",
		action: "banUsers",
	},
	{
		name: "admin:impersonateUsers",
		description: "Impersonate other users",
		resource: "admin",
		action: "impersonateUsers",
	},
];

const resources = ["user", "project", "dashboard", "admin"];
const actions = [
	"read",
	"create",
	"update",
	"delete",
	"manageUsers",
	"manageRoles",
	"banUsers",
	"impersonateUsers",
];

export function PermissionManagement() {
	const [permissions, setPermissions] =
		useState<Permission[]>(defaultPermissions);
	const [isCreating, setIsCreating] = useState(false);
	const [editingPermission, setEditingPermission] = useState<Permission | null>(
		null,
	);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		resource: "",
		action: "",
	});

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			resource: "",
			action: "",
		});
		setIsCreating(false);
		setEditingPermission(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const permissionName = `${formData.resource}:${formData.action}`;

		if (editingPermission) {
			// Update permission
			setPermissions(
				permissions.map((permission) =>
					permission.name === editingPermission.name
						? { ...formData, name: permissionName }
						: permission,
				),
			);
			toast.success("Permission updated successfully");
		} else {
			// Create permission
			if (permissions.find((p) => p.name === permissionName)) {
				toast.error("Permission with this name already exists");
				return;
			}
			setPermissions([...permissions, { ...formData, name: permissionName }]);
			toast.success("Permission created successfully");
		}

		resetForm();
	};

	const handleEdit = (permission: Permission) => {
		setEditingPermission(permission);
		setFormData({
			name: permission.name,
			description: permission.description,
			resource: permission.resource,
			action: permission.action,
		});
		setIsCreating(true);
	};

	const handleDelete = (permissionName: string) => {
		if (defaultPermissions.find((p) => p.name === permissionName)) {
			toast.error("Cannot delete default permissions");
			return;
		}

		if (confirm("Are you sure you want to delete this permission?")) {
			setPermissions(
				permissions.filter((permission) => permission.name !== permissionName),
			);
			toast.success("Permission deleted successfully");
		}
	};

	const getResourceBadgeVariant = (resource: string) => {
		switch (resource) {
			case "admin":
				return "destructive";
			case "user":
				return "default";
			case "project":
				return "secondary";
			case "dashboard":
				return "outline";
			default:
				return "outline";
		}
	};

	const getActionBadgeVariant = (action: string) => {
		switch (action) {
			case "delete":
				return "destructive";
			case "create":
				return "default";
			case "update":
				return "secondary";
			case "read":
				return "outline";
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
							{editingPermission ? "Edit Permission" : "Create New Permission"}
						</CardTitle>
						<CardDescription>
							{editingPermission
								? "Update permission information"
								: "Define a new permission"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="resource">Resource</Label>
									<select
										id="resource"
										value={formData.resource}
										onChange={(e) =>
											setFormData({ ...formData, resource: e.target.value })
										}
										className="w-full p-2 border rounded-md"
										required
									>
										<option value="">Select resource</option>
										{resources.map((resource) => (
											<option key={resource} value={resource}>
												{resource}
											</option>
										))}
									</select>
								</div>
								<div>
									<Label htmlFor="action">Action</Label>
									<select
										id="action"
										value={formData.action}
										onChange={(e) =>
											setFormData({ ...formData, action: e.target.value })
										}
										className="w-full p-2 border rounded-md"
										required
									>
										<option value="">Select action</option>
										{actions.map((action) => (
											<option key={action} value={action}>
												{action}
											</option>
										))}
									</select>
								</div>
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

							{formData.resource && formData.action && (
								<div>
									<Label>Permission Name</Label>
									<div className="p-2 bg-muted rounded-md">
										{formData.resource}:{formData.action}
									</div>
								</div>
							)}

							<div className="flex gap-2">
								<Button type="submit">
									{editingPermission
										? "Update Permission"
										: "Create Permission"}
								</Button>
								<Button type="button" variant="outline" onClick={resetForm}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Permissions List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Permissions</CardTitle>
							<CardDescription>
								Manage system permissions and access controls
							</CardDescription>
						</div>
						<Button onClick={() => setIsCreating(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Permission
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{permissions.map((permission) => (
							<div
								key={permission.name}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
										<Key className="h-4 w-4" />
									</div>
									<div>
										<div className="flex items-center space-x-2">
											<h3 className="font-medium">{permission.name}</h3>
											<Badge
												variant={getResourceBadgeVariant(permission.resource)}
											>
												{permission.resource}
											</Badge>
											<Badge variant={getActionBadgeVariant(permission.action)}>
												{permission.action}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{permission.description}
										</p>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(permission)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									{!defaultPermissions.find(
										(p) => p.name === permission.name,
									) && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDelete(permission.name)}
											className="text-red-600 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div>
						))}

						{permissions.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								No permissions found
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
