import { getFromStore } from '@/worker/src/store'

export type CustomMonitor = {
  id: string
  name: string
  target: string
  statusPageLink?: string
  method?: string
}

const KEY = 'custom_monitors'

export async function getCustomMonitors(env: any): Promise<CustomMonitor[]> {
  try {
    const raw = await getFromStore(env, KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function saveCustomMonitors(env: any, monitors: CustomMonitor[]): Promise<void> {
  await env.UPTIMEFLARE_KV.put(KEY, JSON.stringify(monitors))
}

export function generateMonitorId(target: string): string {
  const host = target.replace(/^https?:\/\//, '').split(/[/?#]/)[0]
  const slug = host.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '')
  return 'custom_' + (slug || 'monitor_' + Date.now())
}