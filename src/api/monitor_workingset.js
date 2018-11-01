import request from '@/utils/request'
export function taskAssignInfo(obj) {
  return request({
    url: '/listManage/taskAssignInfo',
    method: 'get',
    params: obj
  })
}
export function agentStatus(obj) { // 统计成员（支持多个）的状态：通话时长，在线时长，空闲时长，示忙时长，状态，状态更新时间
  return request({
    url: '/ctireportcontroller/agentStatus',
    method: 'get',
    params: obj
  })
}
export function findCampaignByUser() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
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

