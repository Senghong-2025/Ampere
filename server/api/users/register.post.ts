import { readBody } from 'h3'
import { registerUser } from '../../service/userService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return registerUser(body)
})
