import { getQuery } from 'h3'
import { listLoads } from '../../service/loadService'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return listLoads(query)
})
