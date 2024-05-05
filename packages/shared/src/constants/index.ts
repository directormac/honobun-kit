import type { ResponseMessage } from '../types';

export const ERROR_MESSAGE: ResponseMessage = {
	status: 'error',
	message:
		'Something went wrong. Please try again, if you keep getting this error, contact our support team.'
};
