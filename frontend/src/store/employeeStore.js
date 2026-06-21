import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EMPLOYEES } from '../mock/employerData'

let _seq = EMPLOYEES.length + 1

export const useEmployeeStore = create(
  persist(
    (set) => ({
      employees: EMPLOYEES,

      addEmployee({ name, email, department, budgetTotal, password }) {
        const id = `emp-${_seq++}`
        set((s) => ({
          employees: [
            ...s.employees,
            {
              id,
              name,
              email,
              password,
              department,
              budgetTotal: Number(budgetTotal) || 300,
              budgetUsed: 0,
              status: 'pending',
            },
          ],
        }))
      },

      updateEmployee(id, changes) {
        set((s) => ({
          employees: s.employees.map((e) => (e.id === id ? { ...e, ...changes } : e)),
        }))
      },

      updatePasswordByEmail(email, newPassword) {
        set((s) => ({
          employees: s.employees.map((e) =>
            e.email === email ? { ...e, password: newPassword } : e,
          ),
        }))
      },

      removeEmployee(id) {
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }))
      },
    }),
    { name: 'perx-employees-v2' },
  ),
)
