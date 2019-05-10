import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'
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
  return requestV2({
    url: '/customer/phoneAddress/query/phone/phoneReturn',
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
    url: '/auth/users/' + agentId + '/perms/-softbar-/GET',
    method: 'get'
  })
}

export function changeWechatState(req) {
  return request({
    url: '/wechat/updateStatus',
    method: 'post',
    data: req
  })
}
export function getWechatState(angentId) {
  return request({
    url: '/wechat/queryStatus',
    method: 'post',
    data: angentId

  })
}
// 综合查询聊天记录
export function navbarQueryRecords(agentId) {
  return request({
    url: '/wechat/queryRecords',
    method: 'post',
    data: {
      staffId: agentId,
      direction: 0,
      readStatus: '0',
      pageNo: 1
    }
  })
}
// 通过员工id查找技能组
export function queryListByAgentId(agentId) {
  return request({
    url: '/employee/queryListByAgentId',
    method: 'get',
    params: { 'agentId': agentId }
  })
}

