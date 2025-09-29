import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { InvoiceChart } from "@/components/dashboard/invoice-chart";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		return <div>Not authenticated</div>;
	}

	const user = session.user;

	// Mock dashboard stats - replace with real data later
	const dashboardStats = {
		totalInvoices: 45,
		totalCustomers: 28,
		totalRevenue: 125000,
		monthlyRevenue: 18500,
		paidInvoices: 38,
		pendingInvoices: 5,
		overdueInvoices: 2,
		revenueGrowth: 12.5,
		invoiceGrowth: 8.3,
	};

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="container mx-auto p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
							<p className="text-muted-foreground">
								Here's what's happening with your business today
							</p>
						</div>
					</div>

					<DashboardStats stats={dashboardStats} />

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<InvoiceChart />
						</div>
						<div className="space-y-6">
							<QuickActions />
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<RecentInvoices />
						<div className="bg-muted/50 rounded-xl p-6">
							<h3 className="text-lg font-semibold mb-2">Customer Insights</h3>
							<p className="text-muted-foreground">
								Your top customers and recent activity will appear here.
							</p>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
