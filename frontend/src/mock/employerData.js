import { perks } from './perks';

export const EMPLOYEES = [
  { id: 'emp-1', name: 'Ana Koci',    email: 'ana.koci@company.al',    department: 'Engineering', budgetTotal: 300, budgetUsed: 210, status: 'active' },
  { id: 'emp-2', name: 'Erion Dema',  email: 'erion.dema@company.al',  department: 'Design',      budgetTotal: 300, budgetUsed: 90,  status: 'active' },
  { id: 'emp-3', name: 'Mira Hoxha',  email: 'mira.hoxha@company.al',  department: 'Marketing',   budgetTotal: 300, budgetUsed: 300, status: 'active' },
  { id: 'emp-4', name: 'Bledi Gjoka', email: 'bledi.gjoka@company.al', department: 'Sales',       budgetTotal: 300, budgetUsed: 45,  status: 'active' },
  { id: 'emp-5', name: 'Sara Leka',   email: 'sara.leka@company.al',   department: 'HR',          budgetTotal: 300, budgetUsed: 180, status: 'pending' },
];

export const APPROVALS_SEED = [
  { id: 'apr-1', employeeId: 'emp-1', perkId: 'travel-1',   status: 'pending',  requestedAt: '2026-06-19', note: 'Annual wellness checkup' },
  { id: 'apr-2', employeeId: 'emp-2', perkId: 'learning-1', status: 'pending',  requestedAt: '2026-06-18', note: 'Web dev bootcamp for upskilling' },
  { id: 'apr-3', employeeId: 'emp-5', perkId: 'health-1',   status: 'pending',  requestedAt: '2026-06-15', note: 'Team building trip to Ohrid' },
  { id: 'apr-4', employeeId: 'emp-3', perkId: 'gym-2',      status: 'approved', requestedAt: '2026-06-10', note: 'Monthly gym access' },
  { id: 'apr-5', employeeId: 'emp-4', perkId: 'food-1',     status: 'rejected', requestedAt: '2026-06-08', note: '' },
];

export const CATEGORY_CAPS = [
  { id: 'cat-fitness',  label: 'Fitness',  cap: 80,  color: '#7c3aed' },
  { id: 'cat-food',     label: 'Food',     cap: 60,  color: '#06b6d4' },
  { id: 'cat-health',   label: 'Health',   cap: 100, color: '#10b981' },
  { id: 'cat-learning', label: 'Learning', cap: 120, color: '#f59e0b' },
  { id: 'cat-travel',   label: 'Travel',   cap: 150, color: '#8b5cf6' },
  { id: 'cat-wellness', label: 'Wellness', cap: 50,  color: '#06b6d4' },
];

export function enrichApproval(a) {
  const perk     = perks.find(p => p.id === a.perkId)   ?? null;
  const employee = EMPLOYEES.find(e => e.id === a.employeeId) ?? null;
  return { ...a, perk, employee };
}

export function getTopPerks() {
  return [...perks]
    .sort((a, b) => b.used - a.used)
    .slice(0, 5);
}
