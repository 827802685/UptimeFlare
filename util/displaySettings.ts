import { MonitorTarget } from '@/types/config'

export type DisplaySettings = {
  order: string[]
  names: Record<string, string>
  domains: Record<string, string>
  hidden: Record<string, boolean>
}

const STORAGE_KEY = 'uptimeflare-display-settings'

export const emptySettings: DisplaySettings = {
  order: [],
  names: {},
  domains: {},
  hidden: {},
}

export function loadSettings(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...emptySettings }
    const parsed = JSON.parse(raw)
    return {
      order: Array.isArray(parsed.order) ? parsed.order : [],
      names: parsed.names || {},
      domains: parsed.domains || {},
      hidden: parsed.hidden || {},
    }
  } catch {
    return { ...emptySettings }
  }
}

export function saveSettings(settings: DisplaySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

export function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function applySettings(monitors: MonitorTarget[], settings: DisplaySettings): MonitorTarget[] {
  const order = settings.order.filter((id) => monitors.some((m) => m.id === id))
  const visible = monitors.filter((m) => !settings.hidden[m.id])
  if (order.length === 0) {
    return visible.map((m) => ({
      ...m,
      name: settings.names[m.id] || m.name,
      statusPageLink: settings.domains[m.id] || m.statusPageLink,
    }))
  }
  const orderIndex = (id: string) => {
    const idx = order.indexOf(id)
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx
  }
  return visible
    .map((m) => ({
      ...m,
      name: settings.names[m.id] || m.name,
      statusPageLink: settings.domains[m.id] || m.statusPageLink,
    }))
    .sort((a, b) => orderIndex(a.id) - orderIndex(b.id))
}