import type { Request, Response /*, NextFunction */ } from 'express'
import { desc } from 'drizzle-orm'

import { PostsTable, db } from '@/db'
import { codes, handleError } from '@/utils'
import type { Post, ResBody } from '@/types'

/* ========================================================================
     
======================================================================== */

export const getPosts = async (
  _req: Request,
  res: Response<ResBody<Post[] | null>>
) => {
  try {
    //  One can also use the query API.
    // const posts = await db.query.PostsTable.findMany({
    //   orderBy: (posts, funcs) => {
    //     const { desc } = funcs
    //     return desc(posts.createdAt)
    //   }
    // })

    const posts = await db
      .select()
      .from(PostsTable)
      .orderBy(desc(PostsTable.createdAt))

    ///////////////////////////////////////////////////////////////////////////
    //
    //  Existence Check (???):
    //
    // The result of the above query will always be an array of 0 or more items,
    // so there's no need to check for existence.
    //
    //   if (!posts) {
    //     return res.status(404).json({ code: codes.NOT_FOUND, data: null, message: 'Resource not found.', success: false })
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (!posts) {
      return res.status(404).json({
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    return res.status(200).json({
      code: codes.OK,
      data: posts,
      message: 'success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return res.status(500).json(handleError(err))
  }
}
