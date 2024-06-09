import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { USER_ROLES } from '../constants';
import { timestamp, boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role', { enum: [...USER_ROLES] })
		.notNull()
		.default('user'),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, {
			onDelete: 'cascade'
		}),
	expiresAt: timestamp('expires_at').notNull(),
	fresh: boolean('fresh').notNull().default(true)
});

export type UserSchema = InferSelectModel<typeof user>;
export type UserInsertSchema = InferInsertModel<typeof user>;

export type SessionSchema = InferSelectModel<typeof session>;
export type SessionInsertSchema = InferInsertModel<typeof session>;
