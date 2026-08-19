import { NextRequest } from 'next/server'

export const runtime = 'edge'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req: NextRequest): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    })
  }

  const { username, password } = (await req.json()) as { username?: string; password?: string }
  const expectedUsername = process.env.SETTINGS_USERNAME || '827802685@qq.com'
  const expectedPassword = process.env.SETTINGS_PASSWORD || 'zjkl'

  if (username === expectedUsername && password === expectedPassword) {
    return new Response(JSON.stringify({ ok: true }), { headers })
  }
  return new Response(JSON.stringify({ ok: false, error: 'Invalid credentials' }), {
    status: 401,
    headers,
  })
}