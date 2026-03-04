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
    ///////////////////////////////////////////////////////////////////////////
    //
    // https://orm.drizzle.team/docs/indexes-constraints#foreign-key
    // The FOREIGN KEY constraint is used to prevent actions that would destroy
    // links between tables. A FOREIGN KEY is a field (or collection of fields)
    // in one table, that refers to the PRIMARY KEY in another table. The table
    // with the foreign key is called the child table, and the table with the
    // primary key is called the referenced or parent table.
    //
    ///////////////////////////////////////////////////////////////////////////
    .references(() => UsersTable.id, { onDelete: 'cascade' })
    .notNull()
})
