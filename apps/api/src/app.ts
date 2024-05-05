import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import api from '@routes/index';
import { websocket } from '@routes/ws.route';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { serveStatic } from 'hono/bun';

export const dev = process.env.NODE_ENV === 'development';

const app = new Hono();

app.use(
	'*',
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:5173',
			'http://localhost:8787'
		],
		maxAge: 600,
		credentials: true
	})
);

app.use('*', prettyJSON());

app.use('*', logger());

app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

const routes = app.route('', api);

// app.route('/api', routes);

app.get('*', serveStatic({ root: '../web/build' }));
app.get('*', serveStatic({ path: '../web/build/index.html' }));

showRoutes(app);

export { websocket };

export default app;

export type AppType = typeof routes;
