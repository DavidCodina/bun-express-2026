// From Steve Kinney's Advanced Redux With Redux Toolkit, lesson 9 at 2:45
type RequireOnly<T, P extends keyof T> = Pick<T, P> & Partial<Omit<T, P>>

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   type User = {
//     id: string
//     name: string
//     email: string
//     userName: string
//   }
//
//   type CreateUserInput = RequireOnly<User, 'name' | 'email' | 'userName'>
//
//   const userInput:CreateUserInput = {
//     name: 'David',
//     email: 'david@example.com',
//     userName: 'DaveMan'
//   }
//
///////////////////////////////////////////////////////////////////////////

// Mentioned in Matt Pocock video at 3:10
// https://www.youtube.com/watch?v=QSIXYMIJkQg
// type TODO = any
// It's used to mark your any types so you can global search them and eventually replace them.
// The obvious problem here is if you have an actual type Todo for todos.
// Alternative, use something like: type TemporaryAny = any

type TemporaryAny = any
