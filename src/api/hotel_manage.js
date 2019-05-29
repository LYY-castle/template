import requestv2 from '@/utils/request-v2'

/** 新增酒店信息 */
export function save(obj) {
  return requestv2({
    url: '/customer/hotel/hotel',
    method: 'post',
    data: obj
  })
}

/** 修改酒店信息 */
export function update(obj) {
  return requestv2({
    url: '/customer/hotel/hotel',
    method: 'put',
    data: obj
  })
}

/** 通过id查询酒店信息 */
export function findOne(id) {
  return requestv2({
    url: '/customer/hotel/hotel/' + id,
    method: 'get'
  })
}

/** 修改酒店信息状态 */
export function updateStatus(id, status) {
  return requestv2({
    url: '/customer/hotel/hotel/' + id + '/' + status,
    method: 'put'
  })
}

/** 批量修改酒店信息状态 */
export function batchUpdateStatus(obj) {
  return requestv2({
    url: '/customer/hotel/hotel/status',
    method: 'put',
    data: obj
  })
}

/** 综合酒店信息状态 */
export function findAll(obj) {
  return requestv2({
    url: '/customer/hotel/hotels',
    method: 'get',
    params: obj
  })
}

