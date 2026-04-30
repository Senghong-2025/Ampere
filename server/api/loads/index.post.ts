import { readBody } from 'h3'
import { storeLoad } from '../../service/loadService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return storeLoad(body)
})
