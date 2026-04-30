import { getQuery } from 'h3'
import { listGeneratedLoads } from '../../service/generatedLoadService'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return listGeneratedLoads(query)
})
