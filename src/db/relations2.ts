// ❌ import { relations } from 'drizzle-orm'
// ⚠️ Available on drizzle versions 1.0.0-beta.1 and higher.
import { defineRelations } from 'drizzle-orm'

///////////////////////////////////////////////////////////////////////////
//
// In the docs they sometimes just do this: import * as schema from "./schema"
// Then pass schema in as the first argument. That will work fine as long as
// you ONLY export table definitions.
//
//   ❌ import { UsersTable } from './schema/UsersTable'
//   ❌ import { PostsTable } from './schema/PostsTable'
//   ❌ import { UserPreferencesTable } from './schema/UserPreferencesTable'
//
///////////////////////////////////////////////////////////////////////////
import * as schema from './schema'

/* ========================================================================
                            Relations (v2)
======================================================================== */
// https://orm.drizzle.team/docs/relations-schema-declaration

export const relations = defineRelations(schema, (r) => ({
  // One user → one preferences record, one user → many posts
  UsersTable: {
    preferences: r.one.UserPreferencesTable({
      from: r.UsersTable.id,
      to: r.UserPreferencesTable.userId
    }),
    posts: r.many.PostsTable()
  },

  // One post → one author (user)
  PostsTable: {
    author: r.one.UsersTable({
      from: r.PostsTable.authorId,
      to: r.UsersTable.id
    })
  },

  // One preferences record → one user
  UserPreferencesTable: {
    user: r.one.UsersTable({
      from: r.UserPreferencesTable.userId,
      to: r.UsersTable.id
    })
  }
}))
