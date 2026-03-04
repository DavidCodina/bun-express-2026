import type { Request, Response /*, NextFunction */ } from 'express'
import { /* DrizzleError, */ DrizzleQueryError } from 'drizzle-orm/errors'
import { z } from 'zod'

import { UsersTable, db, safeUserFields } from '@/db'
import { codes, formatZodErrors, handleError } from '@/utils'
import type { ResBody, SafeUser } from '@/types'

const CreateUserSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(5)
})

// This is actually more precise than using typeof UsersTable.$inferInsert
type CreateUserInput = z.infer<typeof CreateUserSchema>

/* ========================================================================
     
======================================================================== */

export const createUser = async (
  req: Request<{}, {}, Partial<CreateUserInput>>,
  res: Response<ResBody<SafeUser | null>>
) => {
  const validationResult = CreateUserSchema.safeParse(req.body)

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
  const { username, email, password } = validationResult.data

  /* ======================
          Create User
  ====================== */

  try {
    ///////////////////////////////////////////////////////////////////////////
    //
    // The result is NeonHttpQueryResult<never>
    //
    // {
    //   fields: [],
    //   rows: [],
    //   command: 'INSERT',
    //   rowCount: 1,
    //   rowAsArray: false,
    //   viaNeonFetch: true,
    //   _parsers: [],
    //   _types: TypeOverrides {
    //     _types: {
    //       getTypeParser: [Function: getTypeParser],
    //       setTypeParser: [Function: setTypeParser],
    //       arrayParser: [Object],
    //       builtins: [Object]
    //     },
    //     text: {},
    //     binary: {}
    //   }
    // }
    //
    // To get the actual data back chain on .returning()
    //
    //   [
    //     {
    //       id: 'd5f49176-653c-44b0-8d02-b9b11dd19eb3',
    //       email: 'fred@example.com',
    //       username: 'Fred',
    //       password: '12345',
    //       createdAt: 2026-01-01T18:02:40.409Z,
    //       updatedAt: 2026-01-01T18:02:40.409Z
    //     }
    //   ]
    //
    // Then you need to pick out object from result: result[0]
    //
    /////////////////////////
    //
    // If you're coming from Prisma, this may seem a bit weird.
    // Prisma has a lot of convenience methods that get generated for you,
    // so you can simply do things like this:
    //
    //   const result = await prisma.user.create({ ... })
    //
    // However, the syntax in Drizzle is slightly more verbose and and reflects
    // an intentionally different design philosophy. Drizzle's philosophy is
    // "If you know SQL, you know Drizzle ORM" - it mirrors SQL in its API
    // while Prisma provides a higher-level abstraction designed with common
    // application development tasks in mind.
    //
    // Drizzle is more verbose because:
    //
    //   1. No code generation - Drizzle uses TypeScript inference directly from your schema.
    //      Prisma generates a custom client with methods like .create(), .update(), etc.
    //
    //   2. SQL-like operations - In SQL, you'd write INSERT INTO users ... RETURNING *.
    //      Drizzle mirrors this. There's no magic "create" method because there's no CREATE keyword in SQL.
    //
    //   3. Explicit over implicit - Drizzle is designed as a thin, type-safe wrapper around SQL
    //      The .returning() call and array index access are explicit representations of what's
    //      happening at the database level.
    //
    ///////////////////////////////////////////////////////////////////////////

    const result = await db
      .insert(UsersTable)
      .values({ username, email, password })

      // https://orm.drizzle.team/docs/insert#returning
      .returning(safeUserFields)

    // .onConflictDoUpdate() | .onConflictDoNothing()

    // At this point, one can safely assume that result[0] exists
    // The result array would only be empty if you use:
    // ON CONFLICT DO NOTHING and a conflict occurs.

    const createdUser = result?.[0] || null

    return res.status(201).json({
      code: codes.CREATED,
      data: createdUser,
      message: 'success',
      success: true
    })
  } catch (err) {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Handling Duplicate Email Errors:
    //
    // Rather than doing a proactive check for email duplicates in the try block, we
    // can check for the appropriate error, and conditionally return a 409 here.
    // That said, drilling down into the Error is equally tedious.
    //
    // Technically, the root error is an instance of Bun.SQL.PostgresError, assuming you're
    // using the built-in SQL client. In production, you'll likely be using Neon or some
    // other driver. In any case, Bun.SQL.PostgresError acually gets wrapped in a DrizzleQueryError
    // (which has very little documentation).
    //
    //   export declare class DrizzleQueryError extends Error {
    //     query: string;
    //     params: any[];
    //     cause?: Error | undefined;
    //     constructor(query: string, params: any[], cause?: Error | undefined);
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (err instanceof DrizzleQueryError) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
      const cause = err.cause

      // https://bun.com/reference/bun/SQL/PostgresError
      if (cause instanceof Bun.SQL.PostgresError) {
        // console.log(`
        //   ┌──────────────────────────────────────────────────────────────────────────┐
        //   │                         Bun.SQL.PostgresError                            │
        //   └──────────────────────────────────────────────────────────────────────────┘`,
        //   { name: cause.name, message: cause.message, constraint: cause.constraint }
        // )

        if (cause.constraint === 'users_email_unique') {
          return res.status(409).json({
            code: codes.CONFLICT,
            data: null,
            message: 'That email already exists.',
            success: false
          })
        }
      }
    }

    return res.status(500).json(handleError(err))
  }
}
