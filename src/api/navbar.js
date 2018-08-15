import request from '@/utils/request'

export function addComeContact(req) {
  return request({
    url: '/contact/addComeContact',
    method: 'post',
    data: req
  })
}
export function addDialContact(req) {
  return request({
    url: '/contact/addDialContact',
    method: 'post',
    data: req
  })
}
export function addAnswerContact(req) {
  return request({
    url: '/contact/addAnswerContact',
    method: 'post',
    data: req
  })
}
export function addHangupContact(req) {
  return request({
    url: '/contact/addHangupContact',
    method: 'post',
    data: req
  })
}
export function getPhoneOwn(req) {
  return request({
    url: '/customer/getAddressOwn',
    method: 'get',
    params: { 'phone': req }
  })
}
export function getMenu() {
  return request({
    url: '/login/getNewMenu',
    method: 'post'
  })
}
export function checkSoftphonePerm(agentId) {
  return request({
    url: '/auth/users/' + agentId + '/perms/-softbar/GET',
    method: 'get'
  })
}
