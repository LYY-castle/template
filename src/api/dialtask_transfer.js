import request from '@/utils/request'

export function getAllStaffs() {
  return request({
    url: '/organization/findNextAgentByNow',
    method: 'get'
  })
}

export function filter_split_agents(agentIds) {
  return request({
    url: '/auth/filter-split-agents',
    method: 'get',
    params: { agent_ids: agentIds }
  })
}

export function transferContactTasks(paramsMap) {
  return request({
    url: '/contact/transferContactTasks',
    method: 'post',
    data: paramsMap
  })
}
