import { number, object, string, union, instanceof as zInstanceOf } from 'zod';

export const queryParamsSchema = object({
	q: string().default(''),
	page: number().default(0),
	limit: number().default(10)
});

export const personNameSchema = string()
	.max(100)
	.regex(/^[\p{L}\s-]+$/u, 'Name can only contain alphabets and hyphens');

export const generalNameSchema = string()
	.min(1, 'Name is required')
	.max(100, 'Maximum of 100 characters allowed')
	.regex(
		/^[\p{L}\p{N}\s-]+$/u,
		'Name can only contain alphanumeric characters, spaces, and hyphens'
	);

const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const imageSchema = union([
	string(),
	zInstanceOf(File)
		.refine((f) => f.size < MAX_FILE_SIZE, 'Max 1MB upload size.')
		.refine((f) => f.type.startsWith('image/'), 'Only images are allowed.')
		.optional()
]);

export const mobileNumberSchema = string().regex(
	/^9\d{9}$/,
	'Invalid mobile number'
);

export const requiredString = (
	name: string,
	constraint?: {
		min?: number;
		max?: number;
	}
) => {
	if (constraint?.min && constraint?.max) {
		return string({
			required_error: `${name} is required.`
		})
			.min(
				constraint.min,
				`${name} must contain atleast ${constraint.min} characters.`
			)
			.max(
				constraint.max,
				`${name} must contain atleast ${constraint.max} characters.`
			);
	} else if (constraint?.min) {
		return string({
			required_error: `${name} is required.`
		}).min(
			constraint.min,
			`${name} must contain atleast ${constraint.min} characters.`
		);
	} else if (constraint?.max) {
		return string({
			required_error: `${name} is required.`
		}).max(
			constraint.max,
			`${name} must contain atleast ${constraint.max} characters.`
		);
	} else {
		return string({ required_error: `${name} is required.` });
	}
};

export const amountPreciseSchema = string().regex(/^\d+(\.\d{1,2})?$/, {
	message: 'Invalid amount, Cannot be less than zero.'
});

export const amountSchema = string().regex(/^\d+$/, {
	message:
		'Invalid amount, Cannot be less than zero, cannot have decimal points.'
});

export const realNumberSchema = string().regex(/^\d+$/, {
	message: 'Invalid number, Cannot be less than zero'
});
