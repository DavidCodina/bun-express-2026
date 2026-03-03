import type { Request, Response /*, NextFunction */ } from 'express'

import {
  // asc,
  desc,
  eq
  // ilike
  // sql // Run raw SQL inside of Drizzle.
} from 'drizzle-orm'

import { UserPreferencesTable, UsersTable, db, safeUserFields } from '@/db'

import { codes, handleError } from '@/utils'
import type { ResBody, SafeUser } from '@/types'

/* ========================================================================
     
======================================================================== */

export const getUsers = async (
  _req: Request,
  res: Response<ResBody<SafeUser[] | null>>
) => {
  try {
    // ⚠️ Do NOT include the password, refreshToken, etc.
    // const safeUsers = await db.select(safeUserFields).from(UsersTable)

    ///////////////////////////////////////////////////////////////////////////
    //
    // One can also use the query API.
    //
    // const safeUsers = await db.query.UsersTable.findMany({
    //   columns: { password: false },
    //   // There's also a non-function syntax.
    //   // where: (users, funcs) => {
    //   //   const { ilike } = funcs
    //   //   return ilike(users.email, 'david%')
    //   // },
    //   // The with part necessitates one implement relations. Otherwise, you'll get a TypeError:
    //   // "undefined is not an object (evaluating 'relation.referencedTable')"
    //   with: {
    //     // preferences: true
    //     preferences: {
    //       columns: {
    //         emailUpdates: true
    //       }
    //     }
    //   },
    //   // There is also a non-function syntax.
    //   orderBy: (users, funcs) => {
    //     const { desc } = funcs
    //     return desc(users.createdAt)
    //   }
    //   // limit: 1
    //   // offset: 0,
    //   // extras: {
    //   //   // ⚠️ Gotcha! If you write this wrong it sometimes fails silently,
    //   //   // and gives you back null users. See WDS at 38:00 for a demo:
    //   //   // https://www.youtube.com/watch?v=7-NZ0MlPpJA&t=57s
    //   //   lowerCaseUserName: sql<string>`lower(${UserTable.username})`.as(
    //   //     'lowerCaseUserName'
    //   //   )
    //   // }
    // })
    //
    // This approach requires that you define relations.
    //
    //   export const UserTableRelations = relations(UserTable, ({ one }) => ({
    //     preferences: one(UserPreferencesTable, {
    //       fields: [UserTable.id],
    //       references: [UserPreferencesTable.userId]
    //     })
    //   }))
    //
    // However, the relations API is set to change in the near future, so it may
    // be better to use the more explicit approach.
    //
    ///////////////////////////////////////////////////////////////////////////

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

      // .where(ilike(UsersTable.email, 'fred%'))
      .orderBy(desc(UsersTable.createdAt))

    ///////////////////////////////////////////////////////////////////////////
    //
    //  Existence Check (???):
    //
    // The result of the above query will always be an array of 0 or more items,
    // so there's no need to check for existence.
    //
    //   if (!safeUsers) {
    //     return res.status(404).json({  code: codes.NOT_FOUND, data: null,  message: 'Resource not found.', success: false})
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    return res.status(200).json({
      code: codes.OK,
      data: safeUsers,
      message: 'success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return res.status(500).json(handleError(err))
  }
}
