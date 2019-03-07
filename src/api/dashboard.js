import request from '@/utils/request'

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
// 现场主管
export function checkDepart(agentId) {
  return request({
    url: `/auth/users/${agentId}/perms/-depart-/GET`,
    method: 'get'
  })
}
// 质检主管
export function checkqcDepart(agentId) {
  return request({
    url: `/auth/users/${agentId}/perms/-qc-depart-/GET`,
    method: 'get'
  })
}
// 坐席
export function checkStaff(agentId) {
  return request({
    url: `/auth/users/${agentId}/perms/-staff-/GET`,
    method: 'get'
  })
}
// 质检
export function checkqcStaff(agentId) {
  return request({
    url: `/auth/users/${agentId}/perms/-qc-staff-/GET`,
    method: 'get'
  })
}
