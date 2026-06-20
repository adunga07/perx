import { create } from 'zustand'

let _nextId = 1

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,

  push(notification) {
    const entry = { id: _nextId++, createdAt: Date.now(), read: false, ...notification }
    set(s => ({
      notifications: [entry, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }))
    return entry.id
  },

  markRead(id) {
    set(s => ({
      notifications: s.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - (s.notifications.find(n => n.id === id && !n.read) ? 1 : 0)),
    }))
  },

  markAllRead() {
    set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })), unreadCount: 0 }))
  },

  /* ── toasts ── */
  toast(message, type = 'info', duration = 3500) {
    const id = _nextId++
    set(s => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
    return id
  },

  dismissToast(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },
}))

export const toast = {
  info:    (msg, dur) => useNotificationStore.getState().toast(msg, 'info',    dur),
  success: (msg, dur) => useNotificationStore.getState().toast(msg, 'success', dur),
  warning: (msg, dur) => useNotificationStore.getState().toast(msg, 'warning', dur),
  error:   (msg, dur) => useNotificationStore.getState().toast(msg, 'error',   dur),
}
