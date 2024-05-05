import { serve } from 'bun';
import app, { websocket } from './app';

const server = serve({
	port: process.env.PORT || 3000,
	hostname: '0.0.0.0',
	fetch: app.fetch,
	websocket
});

console.log(`Listening on ${server.hostname}:${server.port} 🔥`);
