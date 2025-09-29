import { createAccessControl } from "better-auth/plugins/access";

/**
 * Define the available resources and actions in your application
 * Make sure to use `as const` so TypeScript can infer the type correctly
 */
export const statement = {
	user: ["create", "read", "update", "delete", "ban", "unban", "impersonate"],
	project: ["create", "read", "update", "delete", "share"],
	dashboard: ["read", "manage"],
	admin: ["full_access"],
} as const;

// Create the access control instance
const ac = createAccessControl(statement);

// Define roles with their permissions
export const user = ac.newRole({
	user: ["read"], // Users can only read their own profile
	project: ["create", "read", "update"], // Users can create, read, and update projects
	dashboard: ["read"], // Users can read dashboard
});

export const moderator = ac.newRole({
	user: ["read", "update"], // Moderators can read and update user profiles
	project: ["create", "read", "update", "delete"], // Moderators can manage projects
	dashboard: ["read", "manage"], // Moderators can manage dashboard
});

export const admin = ac.newRole({
	user: ["create", "read", "update", "delete", "ban", "unban", "impersonate"], // Admins have full user control
	project: ["create", "read", "update", "delete", "share"], // Admins have full project control
	dashboard: ["read", "manage"], // Admins can manage dashboard
	admin: ["full_access"], // Admins have full admin access
});

// Export the access control instance
export { ac };
