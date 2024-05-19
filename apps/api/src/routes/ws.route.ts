import { Hono } from 'hono';
import { upgradeWebSocket } from '.';
import type { AppBindings } from '@app';

const ws = new Hono<AppBindings>()
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
	);

export default ws;
