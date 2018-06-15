import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/login/getNewMenu',
    method: 'post'
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
