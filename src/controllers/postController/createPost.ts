import type { Request, Response /*, NextFunction */ } from 'express'
// import { /* DrizzleError, */ DrizzleQueryError } from 'drizzle-orm/errors'
import { z } from 'zod'

import { PostsTable, db } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { Post, ResBody } from '@/types'

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.uuid('The resource `authorId` must be a valid UUID.')
})

type CreatePostInput = z.infer<typeof CreatePostSchema>

/* ========================================================================
     
======================================================================== */

export const createPost = async (
  req: Request<{}, {}, Partial<CreatePostInput>>,
  res: Response<ResBody<Post | null>>
) => {
  const validationResult = CreatePostSchema.safeParse(req.body)

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
  const { title, content, authorId } = validationResult.data

  /* ======================
          Create Post
  ====================== */

  try {
    const result = await db
      .insert(PostsTable)
      .values({ title, content, authorId })
      .returning()

    const createdPost = result?.[0] || null

    return res.status(201).json({
      code: codes.CREATED,
      data: createdPost,
      message: 'success',
      success: true
    })
  } catch (err) {
    return res.status(500).json(handleError(err))
  }
}
