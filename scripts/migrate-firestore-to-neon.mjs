import dotenv from 'dotenv'
import { neon } from '@neondatabase/serverless'

const args = process.argv.slice(2)

const getArgValue = (name) => {
  const inlineValue = args.find(arg => arg.startsWith(`${name}=`))
  if (inlineValue) return inlineValue.slice(name.length + 1)

  const index = args.indexOf(name)
  if (index >= 0) return args[index + 1]

  return null
}

const hasArg = (name) => args.includes(name)

const pad = (value) => String(value).padStart(2, '0')

const formatDate = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const getDefaultDateRange = (months) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  }
}

const envFile = getArgValue('--env') ?? '.env'
dotenv.config({ path: envFile, override: true, quiet: true })

const databaseUrl = process.env.DATABASE_URL
const firebaseProjectId = process.env.LEGACY_FIREBASE_PROJECT_ID ?? 'ampere-53461'
const firebaseApiKey = process.env.LEGACY_FIREBASE_API_KEY
const months = Number(getArgValue('--months') ?? 3)
const defaultRange = getDefaultDateRange(months)
const startDate = getArgValue('--start') ?? defaultRange.startDate
const endDate = getArgValue('--end') ?? defaultRange.endDate
const dryRun = hasArg('--dry-run')
const updateExisting = hasArg('--update-existing')

if (hasArg('--help') || hasArg('-h')) {
  console.log('Usage: LEGACY_FIREBASE_API_KEY=... node scripts/migrate-firestore-to-neon.mjs [options]')
  console.log('')
  console.log('Options:')
  console.log('  --env .env              Env file containing DATABASE_URL. Default: .env')
  console.log('  --months 3             Calendar months to copy, including current month. Default: 3')
  console.log('  --start YYYY-MM-DD      Override start date')
  console.log('  --end YYYY-MM-DD        Override end date')
  console.log('  --dry-run               Fetch and validate without writing to Neon')
  console.log('  --update-existing       Update matching Neon rows instead of skipping them')
  process.exit(0)
}

if (!databaseUrl) {
  console.error(`DATABASE_URL is not configured in ${envFile}`)
  process.exit(1)
}

if (!firebaseApiKey) {
  console.error('LEGACY_FIREBASE_API_KEY is required')
  process.exit(1)
}

const sql = neon(databaseUrl)

const getFirestoreValue = (value) => {
  if (!value || typeof value !== 'object') return null
  if ('nullValue' in value) return null
  if ('booleanValue' in value) return Boolean(value.booleanValue)
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('stringValue' in value) return String(value.stringValue)
  if ('timestampValue' in value) return String(value.timestampValue)
  if ('arrayValue' in value) {
    return (value.arrayValue.values ?? []).map(getFirestoreValue)
  }
  if ('mapValue' in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields ?? {}).map(([key, field]) => [key, getFirestoreValue(field)]),
    )
  }

  return null
}

const mapFirestoreDocument = (document) => {
  return Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, field]) => [key, getFirestoreValue(field)]),
  )
}

const fetchCollectionByDate = async (collectionId, dateField) => {
  const body = {
    structuredQuery: {
      from: [{ collectionId }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: dateField },
                op: 'GREATER_THAN_OR_EQUAL',
                value: { stringValue: startDate },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: dateField },
                op: 'LESS_THAN_OR_EQUAL',
                value: { stringValue: endDate },
              },
            },
          ],
        },
      },
    },
  }

  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents:runQuery`,
  )
  url.searchParams.set('key', firebaseApiKey)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Firestore ${collectionId} query failed: ${response.status} ${errorText}`)
  }

  const results = await response.json()

  return results
    .filter(result => result.document)
    .map(result => mapFirestoreDocument(result.document))
}

const numberOrZero = (value) => Number(value ?? 0)
const stringOrEmpty = (value) => String(value ?? '')

const normalizeLoad = (load) => ({
  homeId: numberOrZero(load.homeId),
  roomNumber: numberOrZero(load.roomNumber),
  currentKW: numberOrZero(load.currentKW),
  createdOn: stringOrEmpty(load.createdOn),
  modifiedOn: stringOrEmpty(load.modifiedOn || load.createdOn),
})

const normalizeGeneratedLoad = (generatedLoad) => ({
  date: stringOrEmpty(generatedLoad.date),
  homeId: numberOrZero(generatedLoad.homeId),
  totalUsage: numberOrZero(generatedLoad.totalUsage),
  savingAmount: numberOrZero(generatedLoad.savingAmount),
  totalUsageAmount: numberOrZero(generatedLoad.totalUsageAmount),
  extraAmountEachRoom: numberOrZero(generatedLoad.extraAmountEachRoom),
  bankTransfer: numberOrZero(generatedLoad.bankTransfer),
  data: Array.isArray(generatedLoad.data) ? generatedLoad.data : [],
})

const isValidLoad = (load) => {
  return load.homeId > 0 && load.roomNumber > 0 && Boolean(load.createdOn)
}

const isValidGeneratedLoad = (generatedLoad) => {
  return generatedLoad.homeId > 0 && Boolean(generatedLoad.date)
}

const importLoads = async (loads) => {
  const summary = { inserted: 0, updated: 0, skipped: 0, invalid: 0 }

  for (const load of loads) {
    if (!isValidLoad(load)) {
      summary.invalid += 1
      continue
    }

    if (dryRun) {
      summary.inserted += 1
      continue
    }

    const existing = await sql`
      SELECT id::text
      FROM loads
      WHERE home_id = ${load.homeId}
        AND room_number = ${load.roomNumber}
        AND created_on = ${load.createdOn}
      LIMIT 1
    `

    if (existing.length > 0) {
      if (!updateExisting) {
        summary.skipped += 1
        continue
      }

      await sql`
        UPDATE loads
        SET
          current_kw = ${load.currentKW},
          modified_on = ${load.modifiedOn}
        WHERE id = ${existing[0].id}
      `
      summary.updated += 1
      continue
    }

    await sql`
      INSERT INTO loads (home_id, room_number, current_kw, created_on, modified_on)
      VALUES (${load.homeId}, ${load.roomNumber}, ${load.currentKW}, ${load.createdOn}, ${load.modifiedOn})
    `
    summary.inserted += 1
  }

  return summary
}

const importGeneratedLoads = async (generatedLoads) => {
  const summary = { inserted: 0, updated: 0, skipped: 0, invalid: 0 }

  for (const generatedLoad of generatedLoads) {
    if (!isValidGeneratedLoad(generatedLoad)) {
      summary.invalid += 1
      continue
    }

    if (dryRun) {
      summary.inserted += 1
      continue
    }

    const existing = await sql`
      SELECT id::text
      FROM generated_loads
      WHERE home_id = ${generatedLoad.homeId}
        AND date = ${generatedLoad.date}
      LIMIT 1
    `

    if (existing.length > 0) {
      if (!updateExisting) {
        summary.skipped += 1
        continue
      }

      await sql`
        UPDATE generated_loads
        SET
          total_usage = ${generatedLoad.totalUsage},
          saving_amount = ${generatedLoad.savingAmount},
          total_usage_amount = ${generatedLoad.totalUsageAmount},
          extra_amount_each_room = ${generatedLoad.extraAmountEachRoom},
          bank_transfer = ${generatedLoad.bankTransfer},
          data = ${JSON.stringify(generatedLoad.data)}::jsonb
        WHERE id = ${existing[0].id}
      `
      summary.updated += 1
      continue
    }

    await sql`
      INSERT INTO generated_loads (
        date,
        home_id,
        total_usage,
        saving_amount,
        total_usage_amount,
        extra_amount_each_room,
        bank_transfer,
        data
      )
      VALUES (
        ${generatedLoad.date},
        ${generatedLoad.homeId},
        ${generatedLoad.totalUsage},
        ${generatedLoad.savingAmount},
        ${generatedLoad.totalUsageAmount},
        ${generatedLoad.extraAmountEachRoom},
        ${generatedLoad.bankTransfer},
        ${JSON.stringify(generatedLoad.data)}::jsonb
      )
    `
    summary.inserted += 1
  }

  return summary
}

console.log(`Migrating Firestore data from ${startDate} to ${endDate}${dryRun ? ' (dry run)' : ''}`)

const [rawLoads, rawGeneratedLoads] = await Promise.all([
  fetchCollectionByDate('load', 'createdOn'),
  fetchCollectionByDate('generatedLoad', 'date'),
])

const loads = rawLoads.map(normalizeLoad)
const generatedLoads = rawGeneratedLoads.map(normalizeGeneratedLoad)

console.log(`Fetched ${loads.length} load rows and ${generatedLoads.length} generated load rows from Firestore`)

const [loadSummary, generatedLoadSummary] = await Promise.all([
  importLoads(loads),
  importGeneratedLoads(generatedLoads),
])

console.log('Load import:', loadSummary)
console.log('Generated load import:', generatedLoadSummary)
