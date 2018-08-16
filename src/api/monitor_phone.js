import request from '@/utils/request'

export function findNextAgentByNow() {
  return request({
    url: '/organization/findNextAgentByNow',
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
