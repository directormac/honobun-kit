import { type AppBindings } from '@app';
import { queryParamsValidator } from '@middlewares';
import { Hono } from 'hono';

const route = new Hono<AppBindings>().get(
	'/',
	queryParamsValidator,
	async (c) => {
		const { q, limit, page } = c.req.valid('query');

		try {
			return c.json({
				users: []
			});
		} catch {
			return c.json({
				users: []
			});
		}
	}
);

export default route;
