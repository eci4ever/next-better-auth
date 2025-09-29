"use client";

import { Download, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface RecentInvoice {
	id: string;
	invoiceNumber: string;
	customerName: string;
	amount: number;
	status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
	dueDate: string;
}

// Mock data
const recentInvoices: RecentInvoice[] = [
	{
		id: "1",
		invoiceNumber: "INV-001",
		customerName: "Acme Corporation",
		amount: 2500.0,
		status: "paid",
		dueDate: "2024-01-15",
	},
	{
		id: "2",
		invoiceNumber: "INV-002",
		customerName: "TechStart Inc",
		amount: 1800.0,
		status: "sent",
		dueDate: "2024-02-01",
	},
	{
		id: "3",
		invoiceNumber: "INV-003",
		customerName: "Design Studio",
		amount: 950.0,
		status: "overdue",
		dueDate: "2023-12-15",
	},
	{
		id: "4",
		invoiceNumber: "INV-004",
		customerName: "Marketing Pro",
		amount: 3200.0,
		status: "draft",
		dueDate: "2024-02-15",
	},
];

export function RecentInvoices() {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	};

	const getStatusBadgeVariant = (status: RecentInvoice["status"]) => {
		switch (status) {
			case "paid":
				return "default";
			case "sent":
				return "secondary";
			case "overdue":
				return "destructive";
			case "draft":
				return "outline";
			case "cancelled":
				return "outline";
			default:
				return "outline";
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Recent Invoices</CardTitle>
						<CardDescription>Your latest invoice activity</CardDescription>
					</div>
					<Button asChild variant="outline" size="sm">
						<Link href="/dashboard/invoices">View All</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{recentInvoices.map((invoice) => (
						<div
							key={invoice.id}
							className="flex items-center justify-between p-3 border rounded-lg"
						>
							<div className="flex items-center space-x-3">
								<div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
									<FileText className="h-4 w-4" />
								</div>
								<div>
									<div className="flex items-center space-x-2">
										<span className="font-medium">{invoice.invoiceNumber}</span>
										<Badge variant={getStatusBadgeVariant(invoice.status)}>
											{invoice.status}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{invoice.customerName}
									</p>
									<p className="text-xs text-muted-foreground">
										Due: {formatDate(invoice.dueDate)}
									</p>
								</div>
							</div>
							<div className="text-right">
								<div className="font-medium">
									{formatCurrency(invoice.amount)}
								</div>
								<div className="flex space-x-1 mt-1">
									<Button variant="ghost" size="sm">
										<Eye className="h-3 w-3" />
									</Button>
									<Button variant="ghost" size="sm">
										<Download className="h-3 w-3" />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
