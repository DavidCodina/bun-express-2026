import type { Request, Response /*, NextFunction */ } from 'express'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { PostsTable, db } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { Post, ResBody } from '@/types'

const GetPostSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizzle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.')
})

/* ========================================================================
     
======================================================================== */

export const getPost = async (
  req: Request<{ id?: string }>,
  res: Response<ResBody<Post | null>>
) => {
  const validationResult = GetPostSchema.safeParse({ id: req.params.id })

  /* ======================
          id check
  ====================== */
  // In practice, this controller will always have a req.params.id
  // because it's consumed by router.get('/:id', getPost)

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

  try {
    ///////////////////////////////////////////////////////////////////////////
    //
    // One can also use the query API.
    //
    //   const post = await db.query.PostsTable.findFirst({
    //     // where: (posts) => eq(posts.id, id),
    //     where: (posts, { eq }) => eq(posts.id, id)
    //   })
    //
    ///////////////////////////////////////////////////////////////////////////

    const result = await db
      .select()
      .from(PostsTable)
      .where(eq(PostsTable.id, id))

    const post = result?.[0]

    /* ======================
        Existence Check
    ====================== */

    // Return early if no post
    if (typeof post === 'undefined') {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    return res.status(200).json({
      code: codes.OK,
      data: post,
      message: 'success',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return res.status(500).json(handleError(err))
  }
}
