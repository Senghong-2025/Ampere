import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..')

const args = process.argv.slice(2)

const getArgValue = (name) => {
  const inlineValue = args.find(arg => arg.startsWith(`${name}=`))
  if (inlineValue) return inlineValue.slice(name.length + 1)

  const index = args.indexOf(name)
  if (index >= 0) return args[index + 1]

  return null
}

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node database/publish-db.mjs [--env .env.local]')
  console.log('')
  console.log('Without --env, the script loads .env and then .env.local.')
  process.exit(0)
}

const envFile = getArgValue('--env')

if (envFile) {
  dotenv.config({ path: join(rootDir, envFile), override: true })
} else {
  dotenv.config({ path: join(rootDir, '.env') })
  dotenv.config({ path: join(rootDir, '.env.local'), override: true })
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  const envMessage = envFile ? envFile : '.env or .env.local'
  console.error(`DATABASE_URL is not configured in ${envMessage}`)
  process.exit(1)
}

const sql = neon(databaseUrl)

const getSqlFiles = async (folder) => {
  const dir = join(rootDir, 'database', folder)
  const files = await readdir(dir)

  return files
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => join(dir, file))
}

const splitSqlStatements = (script) => {
  const statements = []
  let current = ''
  let dollarQuoteTag = null
  let inSingleQuote = false
  let inDoubleQuote = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = 0; index < script.length; index += 1) {
    const char = script[index]
    const nextChar = script[index + 1]
    current += char

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        current += nextChar
        index += 1
        inBlockComment = false
      }
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag && char === '-' && nextChar === '-') {
      current += nextChar
      index += 1
      inLineComment = true
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag && char === '/' && nextChar === '*') {
      current += nextChar
      index += 1
      inBlockComment = true
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && char === '$') {
      const rest = script.slice(index)
      const tagMatch = rest.match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/)

      if (tagMatch) {
        const tag = tagMatch[0]

        if (!dollarQuoteTag) {
          dollarQuoteTag = tag
          current += tag.slice(1)
          index += tag.length - 1
          continue
        }

        if (dollarQuoteTag === tag) {
          dollarQuoteTag = null
          current += tag.slice(1)
          index += tag.length - 1
          continue
        }
      }
    }

    if (dollarQuoteTag) continue

    if (!inDoubleQuote && char === "'") {
      if (inSingleQuote && nextChar === "'") {
        current += nextChar
        index += 1
        continue
      }

      inSingleQuote = !inSingleQuote
      continue
    }

    if (!inSingleQuote && char === '"') {
      if (inDoubleQuote && nextChar === '"') {
        current += nextChar
        index += 1
        continue
      }

      inDoubleQuote = !inDoubleQuote
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && char === ';') {
      const statement = current.trim()
      if (statement) statements.push(statement)
      current = ''
    }
  }

  const remainingStatement = current.trim()
  if (remainingStatement) statements.push(remainingStatement)

  return statements
}

const publishFolder = async (folder) => {
  const files = await getSqlFiles(folder)

  for (const file of files) {
    const script = await readFile(file, 'utf8')
    const statements = splitSqlStatements(script)
    console.log(`Publishing ${file.replace(`${rootDir}/`, '')} (${statements.length} statements)`)

    for (const statement of statements) {
      await sql.query(statement)
    }
  }
}

await publishFolder('tables')
await publishFolder('functions')

console.log(`Database publish completed${envFile ? ` using ${envFile}` : ''}.`)
