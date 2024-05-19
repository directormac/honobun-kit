import { object, string, union, type infer as zInfer } from 'zod';
import { requiredString } from './util.type';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user, address } from '../schemas';

export const addressSchema = createSelectSchema(address);

export const addressFormSchema = createInsertSchema(address, {
	brgy: (schema) => schema.brgy.min(1, 'Barangay is required'),
	city: (schema) => schema.city.min(1, 'City or municipality is required'),
	province: (schema) => schema.province.optional()
});

const password = string()
	.min(8, 'must be at least 8 characters long')
	.max(64, 'cannot exceed 64 characters')
	.regex(/\d/, 'includes at least one number')
	.regex(/[!@#$%^&*-~_?]/, 'includes at least one special character')
	.regex(/[A-Z]/, 'includes at least one uppercase letter')
	.regex(/[a-z]/, 'includes at least one lowercase letter');

const usernameSchema = requiredString('Username', { min: 3, max: 16 })
	.trim()
	.toLowerCase()
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain letters, numbers, and underscores'
	});

const nameSchema = string()
	.max(100)
	.regex(/^[\p{L}\s-]+$/u, 'Name can only contain alphabets and hyphens');

export const emailSchema = string({
	required_error: 'Email address is required'
}).email({
	message: 'Please enter a valid email address'
});

export const registerSchema = object({
	email: emailSchema
});

const accountKey = union([emailSchema, usernameSchema]);

export const changePasswordSchema = object({
	oldPasswod: string(),
	password,
	passwordConfirm: password
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'New Passwords do not match.'
});

export const resetPasswordSchema = object({
	userId: string(),
	password,
	passwordConfirm: password
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'Passwords do not match.'
});

export const authSchema = object({
	key: accountKey,
	password: string()
});

export const userFormSchema = createInsertSchema(user, {
	id: (schema) => schema.id.optional(),
	username: usernameSchema,
	password,
	address: addressFormSchema
});

export type AuthFormSchema = typeof authSchema;

export type RegisterFormSchema = typeof registerSchema;

export type ChangePasswordFormSchema = typeof changePasswordSchema;

export type Address = zInfer<typeof addressSchema>;

export type UserFormSchema = zInfer<typeof userFormSchema>;

export type AddressFormSchema = zInfer<typeof addressFormSchema>;
