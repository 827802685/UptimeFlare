export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === '/api/data' || url.pathname === '/api/badge') {
      try {
        const db = env.UPTIMEFLARE_D1;
        const result = await db.prepare('SELECT value FROM uptimeflare WHERE key = ?').bind('state').first();
        return new Response(JSON.stringify({ 
          state: result?.value || null,
          timestamp: Date.now()
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }
    
    return new Response('UptimeAPI Worker', { 
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
