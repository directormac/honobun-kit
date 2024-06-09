import { number, object, string } from 'zod';

export const queryParamsSchema = object({
	q: string().default(''),
	page: number().default(0),
	limit: number().default(10)
});
