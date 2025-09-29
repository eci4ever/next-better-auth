"use client";

import {
	Calendar,
	DollarSign,
	FileText,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DashboardStatsProps {
	stats: {
		totalInvoices: number;
		totalCustomers: number;
		totalRevenue: number;
		monthlyRevenue: number;
		paidInvoices: number;
		pendingInvoices: number;
		overdueInvoices: number;
		revenueGrowth: number;
		invoiceGrowth: number;
	};
}

export function DashboardStats({ stats }: DashboardStatsProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatPercentage = (value: number) => {
		return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(stats.totalRevenue)}
					</div>
					<p className="text-xs text-muted-foreground">
						<span
							className={`inline-flex items-center ${stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
						>
							{stats.revenueGrowth >= 0 ? (
								<TrendingUp className="h-3 w-3 mr-1" />
							) : (
								<TrendingDown className="h-3 w-3 mr-1" />
							)}
							{formatPercentage(stats.revenueGrowth)}
						</span>{" "}
						from last month
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
					<FileText className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalInvoices}</div>
					<p className="text-xs text-muted-foreground">
						<span
							className={`inline-flex items-center ${stats.invoiceGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
						>
							{stats.invoiceGrowth >= 0 ? (
								<TrendingUp className="h-3 w-3 mr-1" />
							) : (
								<TrendingDown className="h-3 w-3 mr-1" />
							)}
							{formatPercentage(stats.invoiceGrowth)}
						</span>{" "}
						from last month
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Customers</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalCustomers}</div>
					<p className="text-xs text-muted-foreground">Active customers</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(stats.monthlyRevenue)}
					</div>
					<p className="text-xs text-muted-foreground">This month</p>
				</CardContent>
			</Card>
		</div>
	);
}
