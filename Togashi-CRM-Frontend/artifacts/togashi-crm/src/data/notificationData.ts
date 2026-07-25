import { useState, useEffect, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
}

const INITIAL: NotificationItem[] = [
  { id: 'n-1', title: 'New lead added', description: 'Sparkles Salon Uganda was added as a new lead.', timeAgo: '10 minutes ago', read: false },
  { id: 'n-2', title: 'Proposal follow-up due', description: 'Follow up with Katrina Fashion Finds today.', timeAgo: '45 minutes ago', read: false },
  { id: 'n-3', title: 'Payment recorded', description: 'UGX 4,500,000 was recorded from Amira Interiors.', timeAgo: '3 hours ago', read: true },
  { id: 'n-4', title: 'Upcoming meeting', description: 'Ellipse Investor Meeting begins at 2:00 PM.', timeAgo: '4 hours ago', read: true },
  { id: 'n-5', title: 'Project deadline approaching', description: 'Verax Mobile App milestone is due tomorrow.', timeAgo: 'Yesterday', read: true },
];

let state: NotificationItem[] = [...INITIAL];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getNotifications(): NotificationItem[] {
  return state;
}

export function markAsRead(id: string): void {
  state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllAsRead(): void {
  state = state.map((n) => ({ ...n, read: true }));
  emit();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function useNotifications() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  const markRead = useCallback((id: string) => markAsRead(id), []);
  const markAll = useCallback(() => markAllAsRead(), []);
  return { notifications: state, markAsRead: markRead, markAllAsRead: markAll };
}
