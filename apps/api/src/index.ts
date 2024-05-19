import { serve } from 'bun';
import hono, { wsInstance as websocket } from './app';

const server = serve({
	port: process.env.PORT || 3000,
	hostname: '0.0.0.0',
	fetch: hono.fetch,
	websocket
});

console.log(`Listening on ${server.hostname}:${server.port} 🔥`);
