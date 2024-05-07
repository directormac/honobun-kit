import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import { HTTPException } from 'hono/http-exception';

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

let id = 0;

const routes = hono
	.basePath('/api')
	.get('/', () => {
		throw new HTTPException(403, { message: 'Forbidden' });
	})
	.get('/healthcheck', (c) => c.text('OK'))
	.get('/current-time', (c) => {
		return streamSSE(c, async (stream) => {
			while (true) {
				const message = `${new Date().toISOString()}`;
				await stream.writeSSE({
					data: message,
					event: 'time-update',
					id: String(id++)
				});
				stream.write(message);
				await stream.sleep(1000);
			}
		});
	});

export default hono;

export { routes, hono };
