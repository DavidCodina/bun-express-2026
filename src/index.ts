import 'source-map-support/register.js'
import path from 'node:path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Usage: console.log('Cookies: ', JSON.stringify(req.cookies, null, 2))
import morgan from 'morgan' // Usage: console.log('Request Body: ', JSON.stringify(req.body, null, 2))

////////////////////////////////////////////////////////////////////////////////
//
// When working with bundlers like ESBuild, command line errors often point toward the
// bundled index.js file. This happens because the bundler transforms your code and combines
// it into a single file, and the error is thrown in the context of the transformed code,
// not the original source code. This can be challenging when one is debugging.
// By including this package, it dramatically improves error messaging when your build fails
// due to something like a ReferencError in a deeply nested file. It will end up pointing to
// the actual file and NOT the compiled index.js.
//
////////////////////////////////////////////////////////////////////////////////
import healthRoute from './routes/healthRoute'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import { errorHandler, notFound } from '@/middleware/errorMiddleware'

// No need for dotenv in Bun.
const app = express()

/* ======================
    Global Middleware
====================== */

app.use(morgan('dev'))

// No need to add 'http://localhost:3000' since it's covered
// by process.env.NODE_ENV === 'development' check.
// Otherwise, add allowed domains here...
const allowOrigins: string[] = [
  // 'http://localhost:3000',
  // '...'
]

// Done in video: https://www.youtube.com/watch?v=JR9BeI7FY3M&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=3 at 21:00
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // This should allow all origins during development.
    // This way, we can test Postman calls.
    // An alternative syntax would be: if (!origin) { callback(null, true) }
    if (process.env.NODE_ENV === 'development') {
      // The first arg is the error object.
      // The second arg is the allowed boolean.
      callback(null, true)
      // This else if is saying if the origin URL is in the
      // list of allowedOrigins, then allow it (i.e. callback(null, true))
      // Note: that will also end up disallowing Postman
    } else if (allowOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // This sets the Access-Control-Allow-Credentials header
  // methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  // The default may be 204, but some devices have issues with that
  // (Smart TVs, older browsers, etc), so you might want to set it to 200 instead.
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions)) // You should be able to just do app.use(cors()) when a public API
app.use(express.json({})) // Needed for reading req.body.
app.use(express.urlencoded({ extended: false })) // For handling FormData
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public'))) // For serving static files (CSS, etc.)

/* ======================
        Routes
====================== */

app.use('/api/health', healthRoute)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use(notFound)
app.use(errorHandler)

/* ======================

====================== */

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`)
})
