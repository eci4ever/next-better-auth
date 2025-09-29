"use client";

import { BarChart3, FileText, Plus, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Common tasks and shortcuts</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3">
					<Button
						asChild
						className="h-auto p-4 flex flex-col items-center space-y-2"
					>
						<Link href="/dashboard/invoices">
							<Plus className="h-5 w-5" />
							<span>New Invoice</span>
						</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="h-auto p-4 flex flex-col items-center space-y-2"
					>
						<Link href="/dashboard/customers">
							<UserCheck className="h-5 w-5" />
							<span>Add Customer</span>
						</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="h-auto p-4 flex flex-col items-center space-y-2"
					>
						<Link href="/dashboard/invoices">
							<FileText className="h-5 w-5" />
							<span>View Invoices</span>
						</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="h-auto p-4 flex flex-col items-center space-y-2"
					>
						<Link href="/dashboard/customers">
							<BarChart3 className="h-5 w-5" />
							<span>View Customers</span>
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
