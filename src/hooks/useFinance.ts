import { create } from 'zustand';
import type { IncomeEntry, ExpenseEntry, Client, Project } from '@/types/finance';
import * as svc from '@/services/financeService';
import {
    calculateDashboardMetrics,
    buildMonthlyData,
    calculateExpenseBreakdown,
} from '@/utils/calculations';
import type { DashboardMetrics, MonthlyData } from '@/types/finance';

interface ExpenseBreakdownItem {
    category: string;
    amount: number;
}

interface FinanceStore {
    income: IncomeEntry[];
    expenses: ExpenseEntry[];
    clients: Client[];
    projects: Project[];
    metrics: DashboardMetrics | null;
    monthlyData: MonthlyData[];
    expenseBreakdown: ExpenseBreakdownItem[];
    loading: boolean;

    loadAll: () => Promise<void>;
    addIncome: (entry: Omit<IncomeEntry, 'id'>) => Promise<void>;
    updateIncome: (id: number, updates: Omit<IncomeEntry, 'id'>) => Promise<void>;
    deleteIncome: (id: number) => Promise<void>;

    addExpense: (entry: Omit<ExpenseEntry, 'id'>) => Promise<void>;
    updateExpense: (id: number, updates: Omit<ExpenseEntry, 'id'>) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;

    addClient: (client: Omit<Client, 'id' | 'totalRevenue' | 'projectCount' | 'lastPaymentDate'>) => Promise<Client>;
    updateClient: (id: number, updates: Partial<Omit<Client, 'id' | 'totalRevenue' | 'projectCount' | 'lastPaymentDate'>>) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;

    addProject: (project: Omit<Project, 'id'>) => Promise<void>;
    updateProject: (id: number, updates: Omit<Project, 'id'>) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
    income: [],
    expenses: [],
    clients: [],
    projects: [],
    metrics: null,
    monthlyData: [],
    expenseBreakdown: [],
    loading: false,

    loadAll: async () => {
        set({ loading: true });
        const [income, expenses, clients, projects] = await Promise.all([
            svc.getIncome(),
            svc.getExpenses(),
            svc.getClients(),
            svc.getProjects(),
        ]);
        const metrics = calculateDashboardMetrics(income, expenses);
        const monthlyData = buildMonthlyData(income, expenses);
        const expenseBreakdown = calculateExpenseBreakdown(expenses);
        set({ income, expenses, clients, projects, metrics, monthlyData, expenseBreakdown, loading: false });
    },

    addIncome: async (entry) => {
        const newEntry = await svc.addIncome(entry);
        set((state) => {
            const income = [newEntry, ...state.income];
            const metrics = calculateDashboardMetrics(income, state.expenses);
            const monthlyData = buildMonthlyData(income, state.expenses);
            const clients = state.clients.map((c) =>
                c.name === newEntry.client
                    ? { ...c, totalRevenue: c.totalRevenue + newEntry.amount, lastPaymentDate: newEntry.date }
                    : c
            );
            return { income, metrics, monthlyData, clients };
        });
    },

    addExpense: async (entry) => {
        const newEntry = await svc.addExpense(entry);
        set((state) => {
            const expenses = [newEntry, ...state.expenses];
            const metrics = calculateDashboardMetrics(state.income, expenses);
            const monthlyData = buildMonthlyData(state.income, expenses);
            const expenseBreakdown = calculateExpenseBreakdown(expenses);
            return { expenses, metrics, monthlyData, expenseBreakdown };
        });
    },

    updateExpense: async (id, updates) => {
        const updated = await svc.updateExpense(id, updates);
        set((state) => {
            const expenses = state.expenses.map((e) => (e.id === id ? updated : e));
            const metrics = calculateDashboardMetrics(state.income, expenses);
            const monthlyData = buildMonthlyData(state.income, expenses);
            const expenseBreakdown = calculateExpenseBreakdown(expenses);
            return { expenses, metrics, monthlyData, expenseBreakdown };
        });
    },

    addClient: async (client) => {
        const newClient = await svc.addClient(client);
        set((state) => ({ clients: [newClient, ...state.clients] }));
        return newClient;
    },

    deleteIncome: async (id) => {
        await svc.deleteIncome(id);
        set((state) => {
            const income = state.income.filter((i) => i.id !== id);
            const metrics = calculateDashboardMetrics(income, state.expenses);
            const monthlyData = buildMonthlyData(income, state.expenses);
            return { income, metrics, monthlyData };
        });
    },

    updateIncome: async (id, updates) => {
        const updated = await svc.updateIncome(id, updates);
        set((state) => {
            const income = state.income.map((i) => (i.id === id ? updated : i));
            const metrics = calculateDashboardMetrics(income, state.expenses);
            const monthlyData = buildMonthlyData(income, state.expenses);
            return { income, metrics, monthlyData };
        });
    },

    updateClient: async (id, updates) => {
        const updated = await svc.updateClient(id, updates);
        set((state) => ({
            clients: state.clients.map((c) => (c.id === id ? updated : c))
        }));
    },

    deleteClient: async (id) => {
        await svc.deleteClient(id);
        set((state) => ({
            clients: state.clients.filter((c) => c.id !== id)
        }));
    },

    addProject: async (project) => {
        const newProj = await svc.addProject(project);
        set((state) => ({ projects: [...state.projects, newProj] }));
    },

    updateProject: async (id, updates) => {
        const updated = await svc.updateProject(id, updates);
        set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? updated : p))
        }));
    },

    deleteProject: async (id) => {
        await svc.deleteProject(id);
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id)
        }));
    },

    deleteExpense: async (id) => {
        await svc.deleteExpense(id);
        set((state) => {
            const expenses = state.expenses.filter((e) => e.id !== id);
            const metrics = calculateDashboardMetrics(state.income, expenses);
            const monthlyData = buildMonthlyData(state.income, expenses);
            const expenseBreakdown = calculateExpenseBreakdown(expenses);
            return { expenses, metrics, monthlyData, expenseBreakdown };
        });
    },
}));
