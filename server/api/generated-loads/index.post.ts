import { readBody } from 'h3'
import { storeGeneratedLoad } from '../../service/generatedLoadService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return storeGeneratedLoad(body)
})
