import requestv2 from '@/utils/request-v2'
/* 查询工单列表 */
export function queryList(obj) {
  return requestv2({
    url: '/workflow/workformRecords',
    method: 'get',
    params: obj
  })
}
/* 查询工单详情 */
export function queryOne(id) {
  return requestv2({
    url: `/workflow/workformRecord/${id}`,
    method: 'get'
  })
}
/* 修改工单记录状态 */
export function updateWorkformRecordStatus(req) {
  return requestv2({
    url: '/workflow/workformRecord/status',
    method: 'put',
    data: req
  })
}
/* 修改工单记录 */
export function updateWorkformRecord(req) {
  return requestv2({
    url: `/workflow/workformRecord/${req.id}`,
    method: 'put',
    data: req
  })
}
// 通过工单模板id重发短信
export function reSendMsg(id) {
  return requestv2({
    url: `/workflow/workformRecord/reSendMsg/${id}`,
    method: 'patch'
  })
}
