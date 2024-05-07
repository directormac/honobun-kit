import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { hono } from '@honobun-kit/shared/api';
import ws, { websocket } from '@honobun-kit/shared/ws';
import { showRoutes } from 'hono/dev';
import { serveStatic } from 'hono/bun';

export const dev = process.env.NODE_ENV === 'development';

hono.use('*', prettyJSON());

hono.use('/api/*', logger());

hono.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

hono.route('/ws', ws);

hono.get('*', serveStatic({ root: '../web/build' }));
hono.get('*', serveStatic({ path: '../web/build/index.html' }));

showRoutes(hono);

export { websocket };

export default hono;
