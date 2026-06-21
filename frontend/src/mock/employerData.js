import { perks } from './perks';

export const EMPLOYEES = [
  {
    id: 'emp-1', name: 'Ana Koci', email: 'ana.koci@company.al',
    department: 'Engineering', budgetTotal: 30000, budgetUsed: 21000, status: 'active',
    birthday: '1992-06-20',
    perkHistory: ['gym-1', 'gym-2', 'health-1', 'wellness-1'],
    aiSummary: 'Ana is health-driven and consistently prioritises physical fitness. Her benefit history shows a strong preference for gym access and wellness services — she has used IronPulse Gym passes multiple times and books regular health checkups at CareBloom Clinic. She values proactive self-care over reactive treatment. For birthday gifts, fitness upgrades or premium wellness experiences (e.g. a yoga retreat, spa day, or annual gym membership) would resonate most strongly.',
  },
  {
    id: 'emp-2', name: 'Erion Dema', email: 'erion.dema@company.al',
    department: 'Design', budgetTotal: 30000, budgetUsed: 9000, status: 'active',
    birthday: '1995-06-22',
    perkHistory: ['learning-1', 'travel-1', 'food-1'],
    aiSummary: 'Erion gravitates toward learning and new experiences. His choices span tech education, travel, and social dining — suggesting a curious, growth-oriented mindset. He has invested in a web development bootcamp and a weekend travel package, indicating he values skills that advance his career alongside experiences that broaden his perspective. A birthday gift in the learning or travel space — a new course, a city break, or a dining experience — would be highly appreciated.',
  },
  {
    id: 'emp-3', name: 'Mira Hoxha', email: 'mira.hoxha@company.al',
    department: 'Marketing', budgetTotal: 30000, budgetUsed: 30000, status: 'active',
    birthday: '1990-07-02',
    perkHistory: ['food-1', 'food-2', 'wellness-1', 'health-1'],
    aiSummary: 'Mira shows a clear preference for social and wellness benefits. She regularly selects food deals — both individual lunches and team dining bundles — and combines them with yoga and health checkups. This pattern suggests someone who enjoys shared experiences and prioritises mental as well as physical wellbeing. She has exhausted her full monthly budget, showing high engagement. A birthday gift centred on a premium dining experience or a wellness retreat would be an excellent fit.',
  },
  {
    id: 'emp-4', name: 'Bledi Gjoka', email: 'bledi.gjoka@company.al',
    department: 'Sales', budgetTotal: 30000, budgetUsed: 4500, status: 'active',
    birthday: '1988-03-15',
    perkHistory: ['gym-1', 'wellness-1', 'health-2'],
    aiSummary: 'Bledi has a moderate but consistent engagement with health and fitness benefits. His selections — gym passes, a yoga month pass, and a dental cleaning — suggest he values staying healthy but prefers tried-and-tested options over new experiences. He has used relatively little of his budget, which may indicate he is selective rather than disengaged. A birthday gift that feels like a meaningful upgrade to an existing habit — such as a premium gym membership or a comprehensive wellness checkup — would suit him well.',
  },
  {
    id: 'emp-5', name: 'Sara Leka', email: 'sara.leka@company.al',
    department: 'HR', budgetTotal: 30000, budgetUsed: 18000, status: 'pending',
    birthday: '1993-06-30',
    perkHistory: ['health-1', 'learning-1', 'food-1'],
    aiSummary: 'Sara balances self-improvement with practical self-care. Her benefit choices span a wellness checkup, a coding bootcamp, and healthy lunch deals — pointing to a holistic approach to personal development. As an HR professional she likely champions employee wellbeing, and her own choices reflect that. A birthday gift that speaks to both her health-first mindset and her passion for learning — such as a professional course, a mindfulness programme, or a premium health package — would feel deeply personal.',
  },
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
