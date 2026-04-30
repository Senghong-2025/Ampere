import { createError } from 'h3'
import {
  findGeneratedLoads,
  createGeneratedLoad,
  updateGeneratedLoad,
  deleteGeneratedLoad,
} from '../repo/generatedLoadRepo'
import {
  mapGeneratedLoadRow,
  toGeneratedLoadFilters,
  toGeneratedLoadPayload,
} from '../model/generatedLoad'

export const listGeneratedLoads = async (query: Record<string, unknown>) => {
  const rows = await findGeneratedLoads(toGeneratedLoadFilters(query))

  return rows.map(mapGeneratedLoadRow)
}

export const storeGeneratedLoad = async (body: Record<string, unknown>) => {
  const row = await createGeneratedLoad(toGeneratedLoadPayload(body))

  return mapGeneratedLoadRow(row)
}

export const patchGeneratedLoad = async (id: number, body: Record<string, unknown>) => {
  const row = await updateGeneratedLoad(id, toGeneratedLoadPayload(body))
  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Generated load not found',
    })
  }

  return mapGeneratedLoadRow(row)
}

export const removeGeneratedLoad = async (id: number) => {
  const deleted = await deleteGeneratedLoad(id)
  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Generated load not found',
    })
  }

  return { success: true }
}
