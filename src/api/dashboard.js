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
