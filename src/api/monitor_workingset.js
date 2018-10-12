import request from '@/utils/request'
export function getListUsingByOrganId(obj) {
  return request({
    url: '/listManage/getListUsingByOrganId',
    method: 'get',
    params: obj
  })
}
export function getListUseDetailBillByOrganid(obj) {
  return request({
    url: '/listManage/getListUseDetailBillByOrganid',
    method: 'get',
    params: obj
  })
}
export function departAgents(obj) {
  return request({
    url: '/orderReport/departAgents',
    method: 'get',
    params: obj
  })
}
export function orderReportStatistics(obj) {
  return request({
    url: '/orderReport/departOrStaff/statistics',
    method: 'get',
    params: obj
  })
}
export function agentOrderStatistics(obj) {
  return request({
    url: '/orderReport/agent/statistics',
    method: 'get',
    params: obj
  })
}
export function ctiRecordStatistics(obj) {
  return request({
    url: '/ctireportcontroller/ctirecord',
    method: 'get',
    params: obj
  })
}
export function ctiReportByAgent(obj) {
  return request({
    url: '/ctireportcontroller/ctireportagent',
    method: 'get',
    params: obj
  })
}
var wscti = null
