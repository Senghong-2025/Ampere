export interface LoadRow {
  id: string
  home_id: number
  room_number: number
  current_kw: number
  created_on: string
  modified_on: string
}

export interface LoadPayload {
  homeId: number
  roomNumber: number
  currentKW: number
  createdOn: string
  modifiedOn: string
}

export interface LoadFilters {
  homeId: number
  roomNumber: number | null
  startDate: string
  endDate: string
  limit: number
}

export const mapLoadRow = (row: LoadRow) => ({
  id: String(row.id),
  homeId: Number(row.home_id),
  roomNumber: Number(row.room_number),
  currentKW: Number(row.current_kw),
  createdOn: row.created_on,
  modifiedOn: row.modified_on,
})

export const toLoadPayload = (body: Record<string, unknown>): LoadPayload => ({
  homeId: Number(body.homeId ?? 0),
  roomNumber: Number(body.roomNumber ?? 0),
  currentKW: Number(body.currentKW ?? 0),
  createdOn: String(body.createdOn ?? ''),
  modifiedOn: String(body.modifiedOn ?? ''),
})

export const toLoadFilters = (query: Record<string, unknown>): LoadFilters => ({
  homeId: Number(query.homeId ?? 0),
  roomNumber: query.roomNumber ? Number(query.roomNumber) : null,
  startDate: String(query.startDate ?? ''),
  endDate: String(query.endDate ?? ''),
  limit: Math.min(Number(query.limit ?? 50), 100),
})
