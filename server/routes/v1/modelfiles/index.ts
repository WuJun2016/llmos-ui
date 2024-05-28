import { apiList } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const { q, ids, models, modelIds, sort, order } = getQuery(event) as { q?: string, ids?: string[], models?: string[], modelIds?: string[], sort?: 'id' | 'status.model' | 'status.modelID' | 'status.byteSize', order?: 'asc' | 'desc' }
  console.debug('Listing model files')
  const modelfiles = await apiList('/v1/ml.llmos.ai.modelfiles')
  return modelfiles.filter((mf) => {
    if (!q) return true

    return mf.id.search(new RegExp(q, 'i')) !== -1 || mf.status.model.search(new RegExp(q, 'i')) !== -1 ||
      mf.status.modelID.search(new RegExp(q, 'i')) !== -1 || mf.status.byteSize.search(new RegExp(q, 'i')) !== -1
  }).filter((mf) => {
    if (!ids?.length) return true

    return ids.includes(mf.id)
  }).filter((mf) => {
    if (!models?.length) return true

    return models.includes(mf.status.model)
  }).filter((mf) => {
    if (!modelIds?.length) return true

    return modelIds.includes(mf.status.modelID)
  }).sort((a, b) => {
    if (!sort) return 0

    const aValue = a[sort]
    const bValue = b[sort]

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
})
