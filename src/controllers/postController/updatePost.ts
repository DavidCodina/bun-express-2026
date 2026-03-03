import type { Request, Response /*, NextFunction */ } from 'express'
// import { /* DrizzleError, */ DrizzleQueryError } from 'drizzle-orm/errors'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { PostsTable, db } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { Post, ResBody } from '@/types'

const UpdatePostSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizzle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.'),
  title: z.string().min(1)
})

type UpdatePostInput = Omit<z.infer<typeof UpdatePostSchema>, 'id'>

/* ========================================================================
     
======================================================================== */
//# For now, I'm just updating the title. We may want to make
//# the schema properties optional.

export const updatePost = async (
  req: Request<{ id?: string }, {}, Partial<UpdatePostInput>>,
  res: Response<ResBody<Post | null>>
) => {
  const validationResult = UpdatePostSchema.safeParse({
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
  const { id, title } = validationResult.data
  //# Test what happens when you try to update a nonexistent post.

  try {
    const result = await db
      .update(PostsTable)
      .set({ title })
      .where(eq(PostsTable.id, id))

      .returning()

    const updatedPost = result?.[0] || null

    return res.status(200).json({
      code: codes.UPDATED,
      data: updatedPost,
      message: `success`,
      success: true
    })
  } catch (err) {
    return res.status(500).json(handleError(err))
  }
}
