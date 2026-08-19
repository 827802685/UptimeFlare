import { NextRequest } from 'next/server'
import { saveDisplaySettings } from '@/util/settingsStore'
import { DisplaySettings, emptySettings } from '@/util/displaySettings'

export const runtime = 'edge'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function checkAuth(body: Record<string, any>): boolean {
  const expectedUsername = process.env.SETTINGS_USERNAME || '827802685@qq.com'
  const expectedPassword = process.env.SETTINGS_PASSWORD || 'zjkl'
  return body.username === expectedUsername && body.password === expectedPassword
}

function sanitize(settings: any): DisplaySettings {
  return {
    order: Array.isArray(settings?.order) ? settings.order.filter((i) => typeof i === 'string') : [],
    names: settings?.names && typeof settings.names === 'object' ? settings.names : {},
    domains: settings?.domains && typeof settings.domains === 'object' ? settings.domains : {},
    hidden: settings?.hidden && typeof settings.hidden === 'object' ? settings.hidden : {},
  }
}

export default async function handler(req: NextRequest): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, any>
  if (!checkAuth(body)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  }

  const settings = body.settings
    ? sanitize(body.settings)
    : { ...emptySettings }

  await saveDisplaySettings(process.env as any, settings)
  return new Response(JSON.stringify({ ok: true }), { headers })
}