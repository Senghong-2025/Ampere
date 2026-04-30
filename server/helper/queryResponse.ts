import { getDb } from '../utils/db'

const runQuery = async (strings: TemplateStringsArray, ...values: unknown[]) => {
  const sql = getDb()

  return await sql(strings, ...values)
}

const toRows = <Row>(result: unknown) => result as Row[]

export const queryRows = async <Row>(strings: TemplateStringsArray, ...values: unknown[]) => {
  const result = await runQuery(strings, ...values)

  return toRows<Row>(result)
}

export const queryFirstRow = async <Row>(strings: TemplateStringsArray, ...values: unknown[]) => {
  const rows = await queryRows<Row>(strings, ...values)

  return rows[0] ?? null
}

export const queryRequiredRow = async <Row>(strings: TemplateStringsArray, ...values: unknown[]) => {
  const rows = await queryRows<Row>(strings, ...values)

  return rows[0]!
}

export const queryHasRows = async (strings: TemplateStringsArray, ...values: unknown[]) => {
  const rows = await queryRows<unknown>(strings, ...values)

  return rows.length > 0
}
