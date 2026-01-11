import { pgTable, uuid, text, boolean, jsonb, timestamp, unique } from 'drizzle-orm/pg-core';

// Flows Table
export const flows = pgTable('flows', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  cronExpression: text('cron_expression').notNull(),
  prompt: text('prompt').notNull(),
  actions: jsonb('actions').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Executions Table (Logs)
export const executions = pgTable('executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  flowId: uuid('flow_id').references(() => flows.id, { onDelete: 'cascade' }).notNull(),
  status: text('status', { enum: ['pending', 'success', 'failed'] }).default('pending'),
  logs: jsonb('logs'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Integrations Table (Encrypted Secrets)
export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  provider: text('provider').notNull(), // 'github', 'telegram'
  encryptedToken: text('encrypted_token').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.provider),
}));