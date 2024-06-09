import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { HTTPException } from 'hono/http-exception';
import type { AppBindings } from '../app';

let id = 0;
let pingCount = 1;

const route = new Hono<AppBindings>()
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
	})
	.post('/ping', async (c) => {
		if (pingCount > 73) {
			pingCount = 1;
			return c.json({
				ping: pingCount,
				message: 'pong'
			});
		}
		return c.json({
			ping: pingCount++,
			message: 'pong'
		});
	});

export { route };
