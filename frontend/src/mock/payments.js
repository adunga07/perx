export const payments = [
  { id: 'TXN-2025-001', employeeId: 'emp-1', employeeName: 'Arta Kelmendi',    businessId: 'biz-1', perkId: 'gym-1',     perkTitle: 'Gym Day Pass',          amount: 1800,  currency: 'ALL', status: 'completed', date: '2025-06-18' },
  { id: 'TXN-2025-002', employeeId: 'emp-2', employeeName: 'Driton Hoxha',     businessId: 'biz-2', perkId: 'food-1',    perkTitle: 'Healthy Lunch Deal',    amount: 900,   currency: 'ALL', status: 'completed', date: '2025-06-18' },
  { id: 'TXN-2025-003', employeeId: 'emp-3', employeeName: 'Mirela Gjoka',     businessId: 'biz-3', perkId: 'health-1',  perkTitle: 'Wellness Checkup',      amount: 9600,  currency: 'ALL', status: 'completed', date: '2025-06-17' },
  { id: 'TXN-2025-004', employeeId: 'emp-4', employeeName: 'Altin Shehu',      businessId: 'biz-1', perkId: 'gym-2',     perkTitle: 'Monthly Membership',    amount: 10500, currency: 'ALL', status: 'completed', date: '2025-06-17' },
  { id: 'TXN-2025-005', employeeId: 'emp-5', employeeName: 'Besa Murati',      businessId: 'biz-4', perkId: 'travel-1',  perkTitle: 'Weekend Escape – Ohrid', amount: 26240, currency: 'ALL', status: 'pending',   date: '2025-06-17' },
  { id: 'TXN-2025-006', employeeId: 'emp-1', employeeName: 'Arta Kelmendi',    businessId: 'biz-5', perkId: 'wellness-1',perkTitle: 'Yoga Month Pass',       amount: 4500,  currency: 'ALL', status: 'completed', date: '2025-06-16' },
  { id: 'TXN-2025-007', employeeId: 'emp-6', employeeName: 'Gent Marku',       businessId: 'biz-6', perkId: 'learning-1',perkTitle: 'Web Dev Bootcamp',      amount: 108000,currency: 'ALL', status: 'completed', date: '2025-06-15' },
  { id: 'TXN-2025-008', employeeId: 'emp-2', employeeName: 'Driton Hoxha',     businessId: 'biz-1', perkId: 'gym-1',     perkTitle: 'Gym Day Pass',          amount: 1800,  currency: 'ALL', status: 'completed', date: '2025-06-14' },
  { id: 'TXN-2025-009', employeeId: 'emp-7', employeeName: 'Elona Prendi',     businessId: 'biz-3', perkId: 'health-2',  perkTitle: 'Dental Cleaning',       amount: 3400,  currency: 'ALL', status: 'completed', date: '2025-06-13' },
  { id: 'TXN-2025-010', employeeId: 'emp-8', employeeName: 'Kujtim Dervishi',  businessId: 'biz-2', perkId: 'food-2',    perkTitle: 'Team Lunch Bundle',     amount: 4675,  currency: 'ALL', status: 'failed',    date: '2025-06-12' },
  { id: 'TXN-2025-011', employeeId: 'emp-3', employeeName: 'Mirela Gjoka',     businessId: 'biz-1', perkId: 'gym-3',     perkTitle: 'Personal Training',     amount: 3600,  currency: 'ALL', status: 'completed', date: '2025-06-11' },
  { id: 'TXN-2025-012', employeeId: 'emp-9', employeeName: 'Fatjon Brahimi',   businessId: 'biz-5', perkId: 'wellness-1',perkTitle: 'Yoga Month Pass',       amount: 4500,  currency: 'ALL', status: 'completed', date: '2025-06-10' },
  { id: 'TXN-2025-013', employeeId: 'emp-5', employeeName: 'Besa Murati',      businessId: 'biz-6', perkId: 'learning-1',perkTitle: 'Web Dev Bootcamp',      amount: 108000,currency: 'ALL', status: 'pending',   date: '2025-06-09' },
  { id: 'TXN-2025-014', employeeId: 'emp-10',employeeName: 'Teuta Collaku',    businessId: 'biz-4', perkId: 'travel-1',  perkTitle: 'Weekend Escape – Ohrid', amount: 26240, currency: 'ALL', status: 'completed', date: '2025-06-08' },
  { id: 'TXN-2025-015', employeeId: 'emp-6', employeeName: 'Gent Marku',       businessId: 'biz-2', perkId: 'food-1',    perkTitle: 'Healthy Lunch Deal',    amount: 900,   currency: 'ALL', status: 'completed', date: '2025-06-07' },
]

export function getPaymentsByBusiness(businessId) {
  return payments.filter(p => p.businessId === businessId)
}
