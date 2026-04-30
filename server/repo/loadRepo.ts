import {
  queryFirstRow,
  queryRequiredRow,
  queryRows,
} from '../helper/queryResponse'
import type { LoadFilters, LoadPayload, LoadRow } from '../model/load'

export const findLoads = async (filters: LoadFilters) => {
  if (filters.roomNumber) {
    return queryRows<LoadRow>`
      SELECT id::text, home_id, room_number, current_kw, created_on, modified_on
      FROM loads
      WHERE home_id = ${filters.homeId}
        AND room_number = ${filters.roomNumber}
        AND created_on >= ${filters.startDate}
        AND created_on <= ${filters.endDate}
      ORDER BY created_on DESC, room_number ASC
      LIMIT ${filters.limit}
    `
  }

  return queryRows<LoadRow>`
    SELECT id::text, home_id, room_number, current_kw, created_on, modified_on
    FROM loads
    WHERE home_id = ${filters.homeId}
      AND created_on >= ${filters.startDate}
      AND created_on <= ${filters.endDate}
    ORDER BY room_number ASC, created_on DESC
    LIMIT ${filters.limit}
  `
}

export const findLoadById = async (id: number) => {
  return queryFirstRow<LoadRow>`
    SELECT id::text, home_id, room_number, current_kw, created_on, modified_on
    FROM loads
    WHERE id = ${id}
    LIMIT 1
  `
}

export const createLoad = async (payload: LoadPayload) => {
  return queryRequiredRow<LoadRow>`
    INSERT INTO loads (home_id, room_number, current_kw, created_on, modified_on)
    VALUES (
      ${payload.homeId},
      ${payload.roomNumber},
      ${payload.currentKW},
      ${payload.createdOn},
      ${payload.modifiedOn}
    )
    RETURNING id::text, home_id, room_number, current_kw, created_on, modified_on
  `
}

export const updateLoad = async (id: number, payload: LoadPayload) => {
  return queryFirstRow<LoadRow>`
    UPDATE loads
    SET
      home_id = ${payload.homeId},
      room_number = ${payload.roomNumber},
      current_kw = ${payload.currentKW},
      created_on = ${payload.createdOn},
      modified_on = ${payload.modifiedOn}
    WHERE id = ${id}
    RETURNING id::text, home_id, room_number, current_kw, created_on, modified_on
  `
}
