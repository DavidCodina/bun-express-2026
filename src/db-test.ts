import {
  // asc,
  desc,
  eq
  // ilike
  // sql // Run raw SQL inside of Drizzle.
} from 'drizzle-orm'

import { UserPreferencesTable, UsersTable, db, safeUserFields } from '@/db'

/* ======================
         DB Test
====================== */

export const getUsers = async () => {
  try {
    const safeUsers = await db
      .select({
        ...safeUserFields,
        preferences: UserPreferencesTable
      })
      .from(UsersTable) // Explore other methods after this
      .leftJoin(
        UserPreferencesTable,
        eq(UsersTable.id, UserPreferencesTable.userId)
      )
      // .where(ilike(UserTable.email, 'david%'))
      .orderBy(desc(UsersTable.createdAt))

    console.log(
      `\n
      ┌──────────────────────────────────────────────────────────────────────────┐
      │                                safeUsers                                 │
      └──────────────────────────────────────────────────────────────────────────┘
    `,
      safeUsers
    )
  } catch {
    console.log('\nUnable to get users!')
  }
}
