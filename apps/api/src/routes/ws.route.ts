import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';

const route = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

route.get(
	'/',
	upgradeWebSocket((c) => {
		let intervalId: ReturnType<typeof setInterval>;
		const userAgent = c.req.header('User-Agent');
		return {
			onOpen(_evt, ws) {
				console.log(`${userAgent} - Connected!`);
				intervalId = setInterval(() => {
					ws.send(new Date().toString());
				}, 500);
			},
			onClose() {
				clearInterval(intervalId);
				console.log(`${userAgent} - Disconnected!`);
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
