export interface RegisterUserPayload {
  email: string
  name: string
  password: string
}

export interface UserRow {
  id: string
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
}

export const toRegisterUserPayload = (body: Record<string, unknown>): RegisterUserPayload => ({
  email: String(body.email ?? '').trim().toLowerCase(),
  name: String(body.name ?? '').trim(),
  password: String(body.password ?? ''),
})
