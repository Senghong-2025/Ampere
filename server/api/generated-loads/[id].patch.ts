import { getRouterParam, readBody } from 'h3'
import { toNumericId } from '../../model/common'
import { patchGeneratedLoad } from '../../service/generatedLoadService'

export default defineEventHandler(async (event) => {
  const id = toNumericId(getRouterParam(event, 'id'))
  const body = await readBody(event)

  return patchGeneratedLoad(id, body)
})
