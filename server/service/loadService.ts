import { createError } from 'h3'
import { findLoadById, findLoads, createLoad, updateLoad } from '../repo/loadRepo'
import { mapLoadRow, toLoadFilters, toLoadPayload } from '../model/load'

export const listLoads = async (query: Record<string, unknown>) => {
  const rows = await findLoads(toLoadFilters(query))

  return rows.map(mapLoadRow)
}

export const getLoad = async (id: number) => {
  const row = await findLoadById(id)
  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Load not found',
    })
  }

  return mapLoadRow(row)
}

export const storeLoad = async (body: Record<string, unknown>) => {
  const row = await createLoad(toLoadPayload(body))

  return mapLoadRow(row)
}

export const patchLoad = async (id: number, body: Record<string, unknown>) => {
  const row = await updateLoad(id, toLoadPayload(body))
  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Load not found',
    })
  }

  return mapLoadRow(row)
}
