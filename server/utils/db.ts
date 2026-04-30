import { neon } from '@neondatabase/serverless'
import { createError } from 'h3'

type Db = ReturnType<typeof neon>

let db: Db | null = null

export const getDb = () => {
  if (db) return db

  const config = useRuntimeConfig()
  const databaseUrl = config.databaseUrl
  if (!databaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DATABASE_URL is not configured',
    })
  }

  db = neon(databaseUrl)
  return db
}
