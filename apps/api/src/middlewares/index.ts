import { zValidator } from '@hono/zod-validator';
import { queryParamsSchema } from '../schemas';
import { StatusCodes } from 'http-status-codes';

export const queryParamsValidator = zValidator(
	'query',
	queryParamsSchema,
	(result, c) => {
		if (!result.success) {
			return c.json(
				{
					message: 'Invalid Query Parameters'
				},
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		}
	}
);
