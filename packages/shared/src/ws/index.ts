import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';

const route = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

route.get(
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
);

route.get(
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
);

export { websocket };

export default route;
