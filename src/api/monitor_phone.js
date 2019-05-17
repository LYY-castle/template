import request from '@/utils/request'

export function findNextAgentByNow() {
  return request({
    url: '/organization/findNextAgentByNow',
    method: 'get'
  })
}
export function findNextOrganByNow() {
  return request({
    url: '/organization/findNextOrganByNow',
    method: 'get'
  })
}
export function findStatusByAgentId(agentId) {
  return request({
    url: '/contact/findStatusByAgentId',
    method: 'post',
    data: { 'agentId': agentId }
  })
}
export function findStatusByAgentIds(obj) {
  return request({
    url: '/contact/findStatusByAgentIds',
    method: 'post',
    data: { 'agentIds': obj }
  })
}
export function getStaffNameByAgentId(agentId) {
  return request({
    url: '/employee/query',
    method: 'get',
    params: { 'staffNo': agentId, 'pageable': false }
  })
}
export function getAllChildrenOrgan(departId) {
  return request({
    url: '/organization/getAllChildrenOrgan',
    method: 'get',
    params: { 'departId': departId }
  })
}

