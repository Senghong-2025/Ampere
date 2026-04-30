import { getRouterParam } from 'h3'
import { toNumericId } from '../../model/common'
import { removeGeneratedLoad } from '../../service/generatedLoadService'

export default defineEventHandler(async (event) => {
  const id = toNumericId(getRouterParam(event, 'id'))

  return removeGeneratedLoad(id)
})
