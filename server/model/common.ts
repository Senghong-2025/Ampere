import { createError } from 'h3'

export const toNumericId = (id: string | undefined) => {
  const numericId = Number(id)
  if (!id || !Number.isInteger(numericId) || numericId < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid id',
    })
  }

  return numericId
}
