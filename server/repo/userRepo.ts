import { queryRequiredRow } from '../helper/queryResponse'
import type { RegisterUserPayload, UserRow } from '../model/user'

export const createUser = async (payload: RegisterUserPayload & { passwordHash: string }) => {
  const now = new Date().toISOString()

  return queryRequiredRow<UserRow>`
    INSERT INTO users (email, name, password_hash, created_at, updated_at, role)
    VALUES (${payload.email}, ${payload.name}, ${payload.passwordHash}, ${now}, ${now}, 'user')
    RETURNING id::text, email, name, role, created_at, updated_at
  `
}
