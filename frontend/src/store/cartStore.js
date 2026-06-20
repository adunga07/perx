import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // [{ perk, quantity }]
      drawerOpen: false,

      addItem(perk) {
        set((state) => {
          const existing = state.items.find((i) => i.perk.id === perk.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.perk.id === perk.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { perk, quantity: 1 }] }
        })
      },

      removeItem(perkId) {
        set((state) => ({ items: state.items.filter((i) => i.perk.id !== perkId) }))
      },

      updateQty(perkId, qty) {
        if (qty < 1) { get().removeItem(perkId); return }
        set((state) => ({
          items: state.items.map((i) =>
            i.perk.id === perkId ? { ...i, quantity: qty } : i,
          ),
        }))
      },

      clear() { set({ items: [] }) },

      openDrawer()  { set({ drawerOpen: true  }) },
      closeDrawer() { set({ drawerOpen: false }) },
    }),
    {
      name: 'perx-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const cartTotal = (items) =>
  items.reduce((sum, { perk, quantity }) => {
    const price =
      perk.discount > 0
        ? perk.price - (perk.price * perk.discount) / 100
        : perk.price
    return sum + price * quantity
  }, 0)

export const cartCount = (items) => items.reduce((n, i) => n + i.quantity, 0)
