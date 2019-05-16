import requestv2 from '@/utils/request-v2'
/* 查询工单列表 */
export function queryList(obj) {
  return requestv2({
    url: '/workflow/workformRecord/queryList',
    method: 'get',
    params: obj
  })
}
/* 查询工单详情 */
export function queryOne(id) {
  return requestv2({
    url: '/workflow/workformRecord/queryOne',
    method: 'get',
    params: { 'id': id }
  })
}
/* 修改工单记录状态 */
export function updateWorkformRecordStatus(req) {
  return requestv2({
    url: '/workflow/workformRecord/update/status',
    method: 'put',
    data: req
  })
}

