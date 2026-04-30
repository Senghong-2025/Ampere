export interface GeneratedLoadRow {
  id: string
  date: string
  home_id: number
  total_usage: number
  saving_amount: number
  total_usage_amount: number
  extra_amount_each_room: number
  bank_transfer: number | null
  data: unknown
}

export interface GeneratedLoadPayload {
  date: string
  homeId: number
  totalUsage: number
  savingAmount: number
  totalUsageAmount: number
  extraAmountEachRoom: number
  bankTransfer: number
  data: unknown
}

export interface GeneratedLoadFilters {
  homeId: number
  startDate: string
  endDate: string
  limit: number
}

export const mapGeneratedLoadRow = (row: GeneratedLoadRow) => ({
  id: String(row.id),
  date: row.date,
  homeId: Number(row.home_id),
  totalUsage: Number(row.total_usage),
  savingAmount: Number(row.saving_amount),
  totalUsageAmount: Number(row.total_usage_amount),
  extraAmountEachRoom: Number(row.extra_amount_each_room),
  bankTransfer: Number(row.bank_transfer ?? 0),
  data: Array.isArray(row.data) ? row.data : [],
})

export const toGeneratedLoadPayload = (body: Record<string, unknown>): GeneratedLoadPayload => ({
  date: String(body.date ?? ''),
  homeId: Number(body.homeId ?? 0),
  totalUsage: Number(body.totalUsage ?? 0),
  savingAmount: Number(body.savingAmount ?? 0),
  totalUsageAmount: Number(body.totalUsageAmount ?? 0),
  extraAmountEachRoom: Number(body.extraAmountEachRoom ?? 0),
  bankTransfer: Number(body.bankTransfer ?? 0),
  data: body.data ?? [],
})

export const toGeneratedLoadFilters = (query: Record<string, unknown>): GeneratedLoadFilters => ({
  homeId: Number(query.homeId ?? 0),
  startDate: String(query.startDate ?? ''),
  endDate: String(query.endDate ?? ''),
  limit: Math.min(Number(query.limit ?? 50), 100),
})
