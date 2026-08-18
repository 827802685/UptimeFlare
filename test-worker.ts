export default {
  async fetch(request, env) {
    return new Response('Hello from UptimeAPI!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
