import { getFromStore } from '@/worker/src/store'
import { DisplaySettings, emptySettings } from './displaySettings'

const KEY = 'display_settings'

export async function getDisplaySettings(env: any): Promise<DisplaySettings> {
  try {
    const raw = await getFromStore(env, KEY)
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

export async function saveDisplaySettings(env: any, settings: DisplaySettings): Promise<void> {
  await env.UPTIMEFLARE_KV.put(KEY, JSON.stringify(settings))
}