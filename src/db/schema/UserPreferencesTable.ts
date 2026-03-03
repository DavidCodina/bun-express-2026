import {
  boolean,
  // index,
  // integer,
  // pgEnum,
  pgTable,
  // primaryKey,
  // real,
  // serial
  // text,
  // timestamp,
  uuid
  // varchar
} from 'drizzle-orm/pg-core'

import { UsersTable } from './UsersTable'

/* ========================================================================
     
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a one-to-one relationship between the UserTable and
// UserPreferencesTable. Here's what's happening:
//
//   1. UserTable: Contains user information with an id as primary key.
//   2. UserPreferencesTable: Contains user preferences with a userId
//      field that references the UserTable.id.
//
// This creates a 1:1 relationship where:
//   - Each user preferences record belongs to exactly one user
//   - Each user can have associated preferences.
//
///////////////////////////////////////////////////////////////////////////

export const UserPreferencesTable = pgTable('userPreferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailUpdates: boolean('emailUpdates').default(false).notNull(),
  // Doing this sets up a foreign key constraint on the userId field.
  userId: uuid('userId')
    .references(() => UsersTable.id, {
      onDelete: 'cascade'
    })
    .notNull()
    .unique() // This ensures each user can have only one preferences record
})
