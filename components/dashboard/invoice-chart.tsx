"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Simple chart component using CSS and divs (you can replace with a proper charting library later)
export function InvoiceChart() {
  const monthlyData = [
    { month: "Jan", invoices: 12, revenue: 15000 },
    { month: "Feb", invoices: 18, revenue: 22000 },
    { month: "Mar", invoices: 15, revenue: 18000 },
    { month: "Apr", invoices: 22, revenue: 28000 },
    { month: "May", invoices: 25, revenue: 32000 },
    { month: "Jun", invoices: 20, revenue: 25000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxInvoices = Math.max(...monthlyData.map(d => d.invoices));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue & Invoices</CardTitle>
        <CardDescription>
          Revenue and invoice trends over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Revenue Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">Revenue ($)</h4>
            <div className="flex items-end space-x-2 h-32">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">Invoices</h4>
            <div className="flex items-end space-x-2 h-32">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: `${(data.invoices / maxInvoices) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {data.invoices}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Invoices</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
