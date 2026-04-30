import {
  queryFirstRow,
  queryHasRows,
  queryRequiredRow,
  queryRows,
} from '../helper/queryResponse'
import type {
  GeneratedLoadFilters,
  GeneratedLoadPayload,
  GeneratedLoadRow,
} from '../model/generatedLoad'

export const findGeneratedLoads = async (filters: GeneratedLoadFilters) => {
  return queryRows<GeneratedLoadRow>`
    SELECT
      id::text,
      date,
      home_id,
      total_usage,
      saving_amount,
      total_usage_amount,
      extra_amount_each_room,
      bank_transfer,
      data
    FROM generated_loads
    WHERE home_id = ${filters.homeId}
      AND date >= ${filters.startDate}
      AND date <= ${filters.endDate}
    ORDER BY date DESC
    LIMIT ${filters.limit}
  `
}

export const createGeneratedLoad = async (payload: GeneratedLoadPayload) => {
  return queryRequiredRow<GeneratedLoadRow>`
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
      ${payload.date},
      ${payload.homeId},
      ${payload.totalUsage},
      ${payload.savingAmount},
      ${payload.totalUsageAmount},
      ${payload.extraAmountEachRoom},
      ${payload.bankTransfer},
      ${JSON.stringify(payload.data)}::jsonb
    )
    RETURNING
      id::text,
      date,
      home_id,
      total_usage,
      saving_amount,
      total_usage_amount,
      extra_amount_each_room,
      bank_transfer,
      data
  `
}

export const updateGeneratedLoad = async (id: number, payload: GeneratedLoadPayload) => {
  return queryFirstRow<GeneratedLoadRow>`
    UPDATE generated_loads
    SET
      date = ${payload.date},
      home_id = ${payload.homeId},
      total_usage = ${payload.totalUsage},
      saving_amount = ${payload.savingAmount},
      total_usage_amount = ${payload.totalUsageAmount},
      extra_amount_each_room = ${payload.extraAmountEachRoom},
      bank_transfer = ${payload.bankTransfer},
      data = ${JSON.stringify(payload.data)}::jsonb
    WHERE id = ${id}
    RETURNING
      id::text,
      date,
      home_id,
      total_usage,
      saving_amount,
      total_usage_amount,
      extra_amount_each_room,
      bank_transfer,
      data
  `
}

export const deleteGeneratedLoad = async (id: number) => {
  return queryHasRows`
    DELETE FROM generated_loads
    WHERE id = ${id}
    RETURNING id::text
  `
}
