import { eq } from 'drizzle-orm'
import type { Request, Response /*, NextFunction */ } from 'express'
// import { /* DrizzleError, */ DrizzleQueryError } from 'drizzle-orm/errors'
import { z } from 'zod'

import { UsersTable, db, safeUserFields } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { ResBody } from '@/types'

const DeleteUserSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizzle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.')
})

/* ========================================================================
     
======================================================================== */

export const deleteUser = async (
  req: Request<{ id?: string }>,
  res: Response<ResBody<null>>
) => {
  const validationResult = DeleteUserSchema.safeParse({
    id: req.params.id
  })

  // If you pass in a malformed uuid like '123', then validation will fail.
  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)

    const errorMessage =
      'id' in errors ? errors.id : 'The data failed validation.'

    return res.status(400).json({
      code: codes.BAD_REQUEST,
      data: null,
      message: errorMessage,
      success: false
    })
  }

  // Always use sanitized data from Zod here.
  const { id } = validationResult.data

  //# Test what happens when you try to delete a nonexistent user.

  try {
    const _result = await db
      .delete(UsersTable)
      .where(eq(UsersTable.id, id))
      .returning(safeUserFields)
    // console.log(_result)

    return res.status(200).json({
      code: codes.DELETED,
      data: null,
      message: `success`,
      success: true
    })
  } catch (err) {
    return res.status(500).json(handleError(err))
  }
}
