// Note, it's also possible to have a schema folder such that Drizzle reads from multiple files.
// https://orm.drizzle.team/docs/sql-schema-declaration#schema-in-multiple-files
// However, that seems to make less sense when it comes to passing schema into defineRelations().

export * from './UsersTable'
export * from './PostsTable'
export * from './UserPreferencesTable'

///////////////////////////////////////////////////////////////////////////
//
// In v1 the pattern, relations.ts was partof a barrel that exported everything together.
// In v2, you need to keep them separate because they're distinct arguments to drizzle().
// Thus, relations2.ts is outside of the schema folder, and in src/db/index.ts, we pass it
//into drizzle() as a distinct configuration property.
//
//   export const db = drizzle(process.env.DATABASE_URL!, {
//     relations,
//     schema,
//     logger: true
//   })
//
///////////////////////////////////////////////////////////////////////////

// ❌ export * from './relations'
