import { serve } from 'bun';
import hono, { websocket } from './app';
import { logger } from '@honobun-kit/shared/logger';

const server = serve({
	port: process.env.PORT || 3000,
	hostname: '0.0.0.0',
	fetch: hono.fetch,
	websocket
});

logger.info(`Listening on ${server.hostname}:${server.port} 🔥`);
