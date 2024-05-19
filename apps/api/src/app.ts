import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from 'hono/bun';
import { showRoutes } from 'hono/dev';
import index, { wsInstance } from './routes';
import ws from './routes/ws.route';
import users from './routes/user.route';
import type { Session, User } from 'lucia';

export const dev = process.env.NODE_ENV === 'development';

type AppBindings = {
	Variables: {
		user: User | null;
		session: Session | null;
	};
};

const hono = new Hono();

hono.use(
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

hono.use('/api/*', prettyJSON());

hono.use('/api/*', logger());

hono.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

hono.use('*', serveStatic({ root: './public' }));
hono.use('/assets/*', serveStatic({ root: './public/assets' }));

const routes = hono
	.basePath('/api')
	.route('/', index)
	.route('/ws', ws)
	.route('/users', users);

showRoutes(hono);

export { routes, wsInstance };
export type { AppBindings };

export default hono;
