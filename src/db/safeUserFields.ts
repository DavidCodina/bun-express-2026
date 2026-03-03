import { UsersTable } from './schema/UsersTable'

/* ========================================================================

======================================================================== */
// Note: In practice we could change the key names to get back modified key names.
// const safeUserFields = { userId: UserTable.id, userEmail: UserTable.email, ... }

export const safeUserFields = {
  id: UsersTable.id,
  email: UsersTable.email,
  username: UsersTable.username,
  age: UsersTable.age,
  role: UsersTable.role,
  createdAt: UsersTable.createdAt,
  updatedAt: UsersTable.updatedAt
}
