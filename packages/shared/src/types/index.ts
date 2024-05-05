export type ResponseMessage = {
	message: string;
	status: 'error' | 'success';
	data?: Record<string, unknown>;
	errors?: Record<string, unknown>;
};
