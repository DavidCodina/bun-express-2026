import {
  // boolean,
  // index,
  // integer,
  // pgEnum,
  pgTable,
  // primaryKey,
  // real,
  // serial
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

import { UsersTable } from './UsersTable'

/* ========================================================================
     
======================================================================== */

export const PostsTable = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  // title: text('title').notNull(),
  title: varchar('title', { length: 255 }).notNull(), // .unique(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),

  // This is an example of a many-to-one relationship.
  // Many posts can belong to one user.
  authorId: uuid('authorId')
    .references(() => UsersTable.id, { onDelete: 'cascade' })
    .notNull()
})
