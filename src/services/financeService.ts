import { supabase } from '@/lib/supabase';
import type { IncomeEntry, ExpenseEntry, Client, Project } from '@/types/finance';

// Helper to map DB snake_case columns back to our TS camelCase
const mapIncome = (row: any): IncomeEntry => ({
    id: row.id,
    date: row.date,
    client: row.client,
    project: row.project,
    description: row.description,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    status: row.status as 'Paid' | 'Pending' | 'Overdue' | 'Partial'
});

const mapExpense = (row: any): ExpenseEntry => ({
    id: row.id,
    date: row.date,
    category: row.category,
    description: row.description,
    amount: Number(row.amount)
});

const mapClient = (row: any): Client => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    industry: row.industry,
    totalRevenue: Number(row.total_revenue),
    projectCount: Number(row.project_count),
    lastPaymentDate: row.last_payment_date,
    status: row.status as 'Active' | 'Inactive'
});

const mapProject = (row: any): Project => ({
    id: row.id,
    name: row.name,
    client: row.client,
    clientId: row.client_id,
    startDate: row.start_date,
    endDate: row.end_date,
    revenue: Number(row.revenue),
    costs: Number(row.costs),
    status: row.status as 'Active' | 'Completed' | 'On Hold' | 'Cancelled'
});

// ————————————————————————————————————————————
// INCOME
// ————————————————————————————————————————————

export async function getIncome(): Promise<IncomeEntry[]> {
    const { data, error } = await supabase
        .from('income')
        .select('*')
        .order('date', { ascending: false });
    if (error) throw error;
    return data.map(mapIncome);
}

export async function addIncome(entry: Omit<IncomeEntry, 'id'>): Promise<IncomeEntry> {
    const { data, error } = await supabase
        .from('income')
        .insert([{
            date: entry.date,
            client: entry.client,
            project: entry.project,
            description: entry.description,
            amount: entry.amount,
            payment_method: entry.paymentMethod,
            status: entry.status
        }])
        .select()
        .single();
    if (error) throw error;
    return mapIncome(data);
}

export async function updateIncome(
    id: number,
    updates: Omit<IncomeEntry, 'id'>
): Promise<IncomeEntry> {
    const { data, error } = await supabase
        .from('income')
        .update({
            date: updates.date,
            client: updates.client,
            project: updates.project,
            amount: updates.amount,
            payment_method: updates.paymentMethod,
            status: updates.status
        })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return mapIncome(data);
}

export async function deleteIncome(id: number): Promise<void> {
    const { error } = await supabase.from('income').delete().eq('id', id);
    if (error) throw error;
}

// ————————————————————————————————————————————
// EXPENSES
// ————————————————————————————————————————————

export async function getExpenses(): Promise<ExpenseEntry[]> {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
    if (error) throw error;
    return data.map(mapExpense);
}

export async function addExpense(entry: Omit<ExpenseEntry, 'id'>): Promise<ExpenseEntry> {
    const { data, error } = await supabase
        .from('expenses')
        .insert([entry]) // same shape
        .select()
        .single();
    if (error) throw error;
    return mapExpense(data);
}

export async function updateExpense(
    id: number,
    updates: Omit<ExpenseEntry, 'id'>
): Promise<ExpenseEntry> {
    const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return mapExpense(data);
}

export async function deleteExpense(id: number): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
}

// ————————————————————————————————————————————
// CLIENTS
// ————————————————————————————————————————————

export async function getClients(): Promise<Client[]> {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('total_revenue', { ascending: false });
    if (error) throw error;
    return data.map(mapClient);
}

export async function addClient(
    client: Omit<Client, 'id' | 'totalRevenue' | 'projectCount' | 'lastPaymentDate'>
): Promise<Client> {
    const { data, error } = await supabase
        .from('clients')
        .insert([{
            name: client.name,
            email: client.email,
            phone: client.phone,
            industry: client.industry,
            status: client.status,
            total_revenue: 0,
            project_count: 0,
            last_payment_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();
    if (error) throw error;
    return mapClient(data);
}

export async function updateClient(
    id: number,
    updates: Partial<Omit<Client, 'id' | 'totalRevenue' | 'projectCount' | 'lastPaymentDate'>>
): Promise<Client> {
    // Only mapping fields that can actually be updated by the user
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { data, error } = await supabase
        .from('clients')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return mapClient(data);
}

export async function deleteClient(id: number): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
}

// ————————————————————————————————————————————
// PROJECTS
// ————————————————————————————————————————————

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*');
    if (error) throw error;

    // Sort by profit locally since it's a derived value (revenue - costs)
    return data.map(mapProject).sort((a, b) => b.revenue - b.costs - (a.revenue - a.costs));
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase
        .from('projects')
        .insert([{
            name: project.name,
            client: project.client,
            client_id: project.clientId,
            start_date: project.startDate,
            end_date: project.endDate,
            revenue: project.revenue,
            costs: project.costs,
            status: project.status
        }])
        .select()
        .single();
    if (error) throw error;
    return mapProject(data);
}

export async function updateProject(
    id: number,
    updates: Omit<Project, 'id'>
): Promise<Project> {
    const { data, error } = await supabase
        .from('projects')
        .update({
            name: updates.name,
            client: updates.client,
            client_id: updates.clientId,
            start_date: updates.startDate,
            end_date: updates.endDate,
            revenue: updates.revenue,
            costs: updates.costs,
            status: updates.status
        })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return mapProject(data);
}

export async function deleteProject(id: number): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
}
