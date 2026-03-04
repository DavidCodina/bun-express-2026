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
///////////////////////////////////////////////////////////////////////////
//
// The string 'userRole' is not arbitrary — it's the actual name of the enum type
// that gets created in your PostgreSQL database. It maps directly to the SQL:
// CREATE TYPE "userRole" AS ENUM ('USER', 'ADMIN');
//
//   - It must be unique within your PostgreSQL schema. If you try to create another
//     enum with the same name, you'll get a conflict.
//
//   - It's case-sensitive in Postgres. Using camelCase like 'userRole' means Postgres will
//     require it to be quoted in SQL. A common convention is to use snake_case instead
//     (e.g., 'user_role') to avoid that.
//
//   - It's used in migrations. When Drizzle generates migration files, this is the name it uses
//     to create, alter, or drop the type. If you rename it later, Drizzle will treat it as a
//     drop + re-create, which can be destructive.
//
//   - It appears in your DB schema introspection. If you ever inspect pg_type or use a DB GUI,
//     this is the name you'll see.

//
///////////////////////////////////////////////////////////////////////////
const UserRoleEnum = pgEnum('userRole', ['USER', 'ADMIN'])

const timestamps = {
  // createdAt: timestamp('createdAt', { mode: 'string'}).defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow()
}

/* ========================================================================
     
======================================================================== */
// Review: https://www.npmjs.com/package/drizzle-zod
// Also here at 29:35: https://www.youtube.com/watch?v=Eljdg5_EgOI

export const UsersTable = pgTable(
  'users',
  {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Some demos do this:
    //
    //   id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 })
    //
    // The .generatedAlwaysAsIdentity() maps to a native PostgreSQL feature introduced in Postgres 10:
    //
    //   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
    //
    // It's Postgres's modern replacement for SERIAL. The database itself owns and generates the value
    // — you literally cannot manually insert or override the ID (hence "always"), the DB always controls it.
    //
    // So if you're going to create serial-like ids, don't do this:
    //
    //   ❌ id: serial('id').primaryKey()
    //
    // However, if you want unguessable ids, it's still better to use uuid()
    //
    ///////////////////////////////////////////////////////////////////////////

    id: uuid('id').primaryKey().defaultRandom(),
    // email: text('email').notNull().unique(),

    ///////////////////////////////////////////////////////////////////////////
    //
    // In older MySQL versions, a VARCHAR(255) could store the length in a single byte (0–255),
    // whereas VARCHAR(256) required two bytes. Using 255 was therefore slightly more efficient in MySQL.
    // This is largely cargo-culted convention at this point — developers saw it in tutorials, copied it,
    // and it spread everywhere. In PostgreSQL specifically, it makes no practical difference at all.
    // In PostgreSQL, VARCHAR without a length limit is equivalent to TEXT — there is no enforced maximum.
    // The column can store a string of any length (up to the row size limit of ~1GB, which you'll never hit for an email).
    // The real-world maximum length of an email address is 254 characters, as defined by RFC 5321.
    //  So if you want a meaningful constraint then use 254.
    //
    // The email field already has .unique() which creates an index automatically.
    //
    ///////////////////////////////////////////////////////////////////////////
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: text('username').notNull().unique(),
    // .$default(() => 0), // .$type<12 | 24>(), // .notNull(),
    age: integer('age'),
    role: UserRoleEnum('role').default('USER').notNull(),
    password: text('password').notNull(),
    ...timestamps
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
