///////////////////////////////////////////////////////////////////////////
//
// // https://orm.drizzle.team/docs/get-started/neon-new
// import { drizzle } from 'drizzle-orm/neon-http'
// import * as schema from './schema'
//
// // For neon-http, you can omit the schema and still get good functionality,
// // but including it doesn't hurt and provides better DX if you want to use
// // it in your IDE. You only need it if you want to use Relational Queries
// // (the db.query API).
// export const db = drizzle(process.env.DATABASE_URL!, { schema, logger: true })
//
///////////////////////////////////////////////////////////////////////////

// https://orm.drizzle.team/docs/get-started/bun-sql-new
// Note: Even with the built-in SQL client, you'll still need to bun
// to `bun add postgres` before you can use `npx drizzle-kit push`.
// The postgres package is the more modern version of pg.
import { drizzle } from 'drizzle-orm/bun-sql'
// import * as schema from './schema'
import { relations } from './relations2'

export const db = drizzle(process.env.DATABASE_URL!, {
  logger: true,
  relations
  // With Drizzle's relations v2 API, passing schema separately to drizzle()
  // is redundant. It's already been included through relations.
  // ❌ schema
})
