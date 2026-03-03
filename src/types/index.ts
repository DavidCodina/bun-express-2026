// This is an example of a type that can be used as a client/server contract for API calls.

import type { PostsTable, UsersTable } from '@/db/schema'

import type { CustomError, codes } from '@/utils'

export type { CustomError }

export type Code = (typeof codes)[keyof typeof codes]

export type ResBody<DataType> = {
  code: Code
  data: DataType
  errors?: Record<string, string> | null
  message: string
  success: boolean
  // Adding this makes the type more flexible, while still being informative. That
  // said, if you need additional properties, it's MUCH safer to write a custom type.
  // [key: string]: any
}

export type ResponsePromise<T = unknown> = Promise<ResBody<T>>

/* ======================

====================== */

export type User = typeof UsersTable.$inferSelect
export type CreateUserInput = typeof UsersTable.$inferInsert
export type SafeUser = Omit<User, 'password'>

export type Post = typeof PostsTable.$inferSelect
export type CreatePostInput = typeof PostsTable.$inferInsert

// UserTable.$inferInsert gets you pretty close,
// but we actually want to nail it down further.
export type CreateUserData = Omit<
  typeof UsersTable.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>
