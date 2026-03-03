// import { relations } from 'drizzle-orm'
// import { UsersTable } from './UsersTable'
// import { PostsTable } from './PostsTable'
// import { UserPreferencesTable } from './UserPreferencesTable'

/* ========================================================================
                              Relations
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The "userPreferences" column you see in Drizzle Studio is showing the table
// relationship, but it doesn't automatically include the related data in your queries.
//
// One approach to including userPreferences is to do this in getUsers.ts:
//
//   const safeUsers = await db.query.UserTable.findMany({
//     columns: { password: false },
//     with: { preferences: true }
//   })
//
// However, this requires that you define relations here. That said, I think
// the relations API is set to change in the near future, so I'm sticking with
// the more explicit approach.
//
//   const safeUsers = await db
//     .select({ ...safeUserFields, preferences: UserPreferencesTable })
//     .from(UserTable)
//     .leftJoin(UserPreferencesTable, eq(UserTable.id, UserPreferencesTable.userId))
//
///////////////////////////////////////////////////////////////////////////

/*
// One user can have many posts.
// One user can have one preferences
export const UsersTableRelations = relations(UsersTable, (helpers) => {
  const { one, many } = helpers
  return {
    preferences: one(UserPreferencesTable, {
      fields: [UsersTable.id],
      references: [UserPreferencesTable.userId]
    }),
    posts: many(PostsTable)
  }
})

// One post can have one author.
export const PostsTableRelations = relations(PostsTable, (helpers) => {
  const { one } = helpers

  return {
    author: one(UsersTable, {
      fields: [PostsTable.authorId],
      references: [UsersTable.id]
    })
  }
})

// One preferences record can belong to one user.
export const UserPreferencesTableRelations = relations(
  UserPreferencesTable,
  (helpers) => {
    const { one } = helpers
    return {
      user: one(UsersTable, {
        fields: [UserPreferencesTable.userId],
        references: [UsersTable.id]
      })
    }
  }
  
)
*/

export default {}
