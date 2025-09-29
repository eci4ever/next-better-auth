"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Eye, Download, MoreHorizontal, FileText, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  createdAt: string;
  description?: string;
}

// Mock data for demonstration
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customerName: "Acme Corporation",
    customerEmail: "billing@acme.com",
    amount: 2500.00,
    status: "paid",
    dueDate: "2024-01-15",
    createdAt: "2024-01-01",
    description: "Website Development Services"
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customerName: "TechStart Inc",
    customerEmail: "finance@techstart.com",
    amount: 1800.00,
    status: "sent",
    dueDate: "2024-02-01",
    createdAt: "2024-01-15",
    description: "Mobile App Development"
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customerName: "Design Studio",
    customerEmail: "admin@designstudio.com",
    amount: 950.00,
    status: "overdue",
    dueDate: "2023-12-15",
    createdAt: "2023-12-01",
    description: "Logo Design Package"
  }
];

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isCreating, setIsCreating] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    customerEmail: "",
    amount: "",
    status: "draft" as Invoice["status"],
    dueDate: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      customerName: "",
      customerEmail: "",
      amount: "",
      status: "draft",
      dueDate: "",
      description: "",
    });
    setIsCreating(false);
    setEditingInvoice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInvoice) {
      // Update invoice
      setInvoices(invoices.map(invoice => 
        invoice.id === editingInvoice.id 
          ? { ...invoice, ...formData, amount: parseFloat(formData.amount) }
          : invoice
      ));
      toast.success("Invoice updated successfully");
    } else {
      // Create invoice
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setInvoices([newInvoice, ...invoices]);
      toast.success("Invoice created successfully");
    }
    
    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      amount: invoice.amount.toString(),
      status: invoice.status,
      dueDate: invoice.dueDate,
      description: invoice.description || "",
    });
    setIsCreating(true);
  };

  const handleDelete = (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      toast.success("Invoice deleted successfully");
    }
  };

  const getStatusBadgeVariant = (status: Invoice["status"]) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
            </CardTitle>
            <CardDescription>
              {editingInvoice ? "Update invoice information" : "Create a new invoice for a customer"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    placeholder="INV-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice["status"] })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="billing@acme.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service description"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingInvoice ? "Update Invoice" : "Create Invoice"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage your invoices and track payment status
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatCurrency(invoice.amount)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {formatDate(invoice.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {invoices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
