import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'
import { join } from 'path'

export function getMenu(userId) {
  return request({
    url: `auth/${userId}/menus`
  })
}

export function checkPerm() {
  return request({
    url: '/login/checkPerm',
    method: 'post'
  })
}

export function findContactHistory() {
  return request({
    url: '/contact/findContactHistory',
    method: 'get'
  })
}
export function getUserInfo() {
  return request({
    url: '/login/getUserInfo',
    method: 'get'
  })
}

export function getSubordinate(ids) {
  return request({
    url: `/employee/getAllStaffByDepartId`,
    params: { ids: ids }
  })
}

export function getIncallStatistical(agentIds) {
  return requestV2({
    url: `/report/ctireport/incall_statistics/today`,
    params: { agent_id: agentIds }
  })
}
