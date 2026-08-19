import { NextRequest } from 'next/server'
import { getCustomMonitors, saveCustomMonitors, generateMonitorId } from '@/util/customMonitors'

export const runtime = 'edge'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function checkAuth(body: Record<string, any>): boolean {
  const expectedUsername = process.env.SETTINGS_USERNAME || '827802685@qq.com'
  const expectedPassword = process.env.SETTINGS_PASSWORD || 'zjkl'
  return body.username === expectedUsername && body.password === expectedPassword
}

export default async function handler(req: NextRequest): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  const env = process.env as any
  const monitors = await getCustomMonitors(env)

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ monitors }), { headers })
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, any>
  if (!checkAuth(body)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  }

  if (req.method === 'POST') {
    const { name, target } = body
    if (!name || !target) {
      return new Response(JSON.stringify({ error: 'name and target required' }), {
        status: 400,
        headers,
      })
    }
    if (!/^https?:\/\//.test(target)) {
      return new Response(JSON.stringify({ error: 'target must start with http(s)://' }), {
        status: 400,
        headers,
      })
    }
    const id = body.id || generateMonitorId(target)
    const exists = monitors.find((m) => m.id === id)
    const updated = exists
      ? monitors.map((m) => (m.id === id ? { ...m, name, target, statusPageLink: target } : m))
      : [...monitors, { id, name, target, statusPageLink: target }]
    await saveCustomMonitors(env, updated)
    return new Response(JSON.stringify({ ok: true, id }), { headers })
  }

  if (req.method === 'DELETE') {
    const { id } = body
    const updated = monitors.filter((m) => m.id !== id)
    await saveCustomMonitors(env, updated)
    return new Response(JSON.stringify({ ok: true }), { headers })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
}