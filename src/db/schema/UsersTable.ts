import {
  // boolean,
  // index,
  integer,
  pgEnum,
  pgTable,
  // primaryKey,
  // real,
  // serial
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

const UserRoleEnum = pgEnum('userRole', ['USER', 'ADMIN'])

/* ========================================================================
     
======================================================================== */
// Review: https://www.npmjs.com/package/drizzle-zod
// Also here at 29:35: https://www.youtube.com/watch?v=Eljdg5_EgOI

export const UsersTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // email: text('email').notNull().unique(),
    // The email field already has .unique() which creates an index automatically.
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: text('username').notNull().unique(),
    // .$default(() => 0), // .$type<12 | 24>(), // .notNull(),
    age: integer('age'),
    role: UserRoleEnum('role').default('USER').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow()
  }
  // Callback syntax is deprecated.
  // (_table) => { return {} }
)

// In Drizzle ORM v0.29+, indexes should be defined as separate exports after the table
// definition rather than in a callback function. The .unique() constraint already creates
// an index on the email field, so the additional named index is optional but shown here
// for completeness.

// Since email already has .unique(), this index is redundant but kept for example
// export const emailIndex = index('emailIndex').on(UserTable.email)
