import { createError } from 'h3'
import { toRegisterUserPayload } from '../model/user'
import { createUser } from '../repo/userRepo'

const hashPassword = async (password: string) => {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const registerUser = async (body: Record<string, unknown>) => {
  const payload = toRegisterUserPayload(body)

  if (!payload.email || !payload.name || payload.password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid registration data',
    })
  }

  try {
    return await createUser({
      ...payload,
      passwordHash: await hashPassword(payload.password),
    })
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'This email is already registered',
      })
    }

    throw error
  }
}
