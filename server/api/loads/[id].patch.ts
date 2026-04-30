import { getRouterParam, readBody } from 'h3'
import { toNumericId } from '../../model/common'
import { patchLoad } from '../../service/loadService'

export default defineEventHandler(async (event) => {
  const id = toNumericId(getRouterParam(event, 'id'))
  const body = await readBody(event)

  return patchLoad(id, body)
})
