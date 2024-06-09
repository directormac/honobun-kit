import { ServerWebSocket, serve } from 'bun';
import hono, { AppType } from './app';
import { serveStatic } from 'hono/bun';
import { createBunWebSocket } from 'hono/bun';

const { upgradeWebSocket, websocket } = createBunWebSocket();

hono
	.use('*', serveStatic({ root: './public' }))
	.use('/assets/*', serveStatic({ root: './public/assets' }))
	.get(
		'/',
		upgradeWebSocket((c) => {
			let intervalId: ReturnType<typeof setInterval>;
			return {
				onOpen(_evt, ws) {
					intervalId = setInterval(() => {
						ws.send(new Date().toISOString());
					}, 1000);
				},
				onClose() {
					clearInterval(intervalId);
				}
			};
		})
	)
	.get(
		'/ping',
		upgradeWebSocket((c) => {
			let counter = 0;
			return {
				onMessage(evt, ws) {
					if (evt.data === 'ping' && counter < 73) {
						ws.send(`Pong ${counter++}`);
					} else {
						ws.send(`Max Ping reached. Closing connection.`);
						ws.close(1000, 'No more pings allowed. Closing connection.');
					}
				}
			};
		})
	)
	.get(
		'pubsub',
		upgradeWebSocket((c) => {
			return {
				onOpen(evt, ws) {
					const raw = ws.raw as ServerWebSocket;
					raw.subscribe('pubsub');
				},
				onMessage(evt, ws) {
					// const raw = ws.raw as ServerWebSocket;
					// console.log(raw.isSubscribed('pubsub'));
					server.publish('pubsub', `Subscriber ${evt.data}`);
				}
			};
		})
	);

const server = serve({
	port: process.env.PORT || 3000,
	hostname: '0.0.0.0',
	fetch: hono.fetch,
	websocket
});

console.log(`Listening on ${server.hostname}:${server.port} 🔥`);

export type { AppType };
