import { getRouterParam } from 'h3'
import { toNumericId } from '../../model/common'
import { getLoad } from '../../service/loadService'

export default defineEventHandler(async (event) => {
  const id = toNumericId(getRouterParam(event, 'id'))

  return getLoad(id)
})
