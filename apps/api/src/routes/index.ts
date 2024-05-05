import { Hono } from 'hono';
import live from './ws.route';
import { HTTPException } from 'hono/http-exception';

const routes = new Hono().basePath('/api');

routes.get('/', () => {
	throw new HTTPException(403, { message: 'Forbidden' });
});

routes.get('/healthcheck', (c) => c.text('OK'));

routes.route('/ws', live);

export default routes;
