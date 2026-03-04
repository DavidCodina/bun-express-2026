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
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://orm.drizzle.team/docs/sql-schema-declaration#camel-and-snake-casing
  // Database model names often use snake_case conventions, while in TypeScript,
  // it is common to use camelCase for naming models. This can lead to a lot of
  // alias definitions in the schema. To address this, Drizzle provides a way to
  // automatically map camelCase from TypeScript to snake_case in the database
  // by including one optional parameter during Drizzle database initialization
  //
  // casing: 'snake_case',
  //
  ///////////////////////////////////////////////////////////////////////////
  logger: true,
  relations
  ///////////////////////////////////////////////////////////////////////////
  //
  // With Drizzle's relations v2 API, passing schema separately to drizzle()
  // is redundant. It's already been included through relations.
  // Note: When implementing BetterAuth, you'll likely need to pass the schema
  // in the adapter's config. See here at 13:40: https://www.youtube.com/watch?v=N4-VDia4NcI
  //
  // ❌ schema
  //
  ///////////////////////////////////////////////////////////////////////////
})
