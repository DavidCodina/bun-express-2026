// With Bun, we don't need dotenv.
// It's also likely that we wouldn't need tsx when using the Neon integration.
// import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },

  verbose: true,
  strict: true
  // breakpoints: true,
})
