// TypeScript types for the FiVision Finance Tracker

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partial';
export type PaymentMethod = 'Bank Transfer' | 'GCash' | 'Cash' | 'PayMaya' | 'Check';
export type ExpenseCategory =
    | 'Software'
    | 'Marketing'
    | 'Advertising'
    | 'Payroll'
    | 'Hosting'
    | 'Tools'
    | 'Operations';

export interface IncomeEntry {
    id: number;
    date: string; // ISO 8601 date string
    client: string;
    project: string;
    description: string | null;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
}

export interface ExpenseEntry {
    id: number;
    date: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    industry: string;
    totalRevenue: number;
    projectCount: number;
    lastPaymentDate: string;
    status: 'Active' | 'Inactive';
}

export interface Project {
    id: number;
    name: string;
    client: string;
    clientId: number;
    startDate: string;
    endDate: string | null;
    revenue: number;
    costs: number;
    status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
}

export interface MonthlyData {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
}

export interface DashboardMetrics {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    cashFlow: number;
    revenueGrowth: number;
    expenseGrowth: number;
    profitGrowth: number;
    cashFlowGrowth: number;
}
