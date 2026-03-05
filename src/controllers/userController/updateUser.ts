import type { Request, Response /*, NextFunction */ } from 'express'
// import { /* DrizzleError, */ DrizzleQueryError } from 'drizzle-orm/errors'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { UsersTable, db, safeUserFields } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { ResBody, SafeUser } from '@/types'

const UpdateUserSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizzle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.'),
  username: z.string().min(1)
})

type UpdateUserInput = Omit<z.infer<typeof UpdateUserSchema>, 'id'>

/* ========================================================================
     
======================================================================== */
//# For now, I'm just updating the username, if we actually updated the email,
//# we'd also need to check for duplicates. Additinally, we may want to make
//# the schema properties like username optional.

export const updateUser = async (
  req: Request<{ id?: string }, {}, Partial<UpdateUserInput>>,
  res: Response<ResBody<SafeUser | null>>
) => {
  const validationResult = UpdateUserSchema.safeParse({
    id: req.params.id,
    ...req.body
  })

  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)

    return res.status(400).json({
      code: codes.BAD_REQUEST,
      data: null,
      errors: errors,
      message: 'The data failed validation.',
      success: false
    })
  }

  // Always use sanitized data from Zod here.
  const { id, username } = validationResult.data
  //# Test what happens when you try to update a nonexistent user.

  try {
    const result = await db
      .update(UsersTable)
      .set({ username })
      .where(eq(UsersTable.id, id))
      // NOT available for MySQL - https://orm.drizzle.team/docs/update#returning
      .returning(safeUserFields)

    const updatedUser = result?.[0] || null

    return res.status(200).json({
      code: codes.UPDATED,
      data: updatedUser,
      message: `success`,
      success: true
    })
  } catch (err) {
    return res.status(500).json(handleError(err))
  }
}
