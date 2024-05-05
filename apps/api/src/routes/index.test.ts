import { describe, expect, it, beforeEach } from 'bun:test';
import app from './index';

describe('/api Routes', () => {
	const url = 'http://localhost/api';
	let req: Request;

	it('should return 403', async () => {
		req = new Request(`${url}`);
		const res = await app.fetch(req);
		expect(res.status).toBe(403);
	});

	it('should return 404', async () => {
		req = new Request(`${url}/not-found`);
		const res = await app.fetch(req);
		expect(res.status).toBe(404);
	});

	it('should return 200 and OK', async () => {
		req = new Request(`${url}/healthcheck`);
		const res = await app.fetch(req);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe('OK');
	});
});
