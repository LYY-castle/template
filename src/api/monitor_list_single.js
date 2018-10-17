import request from '@/utils/request'

//   老版本的接口 查所有有效的活动
export function findCampaignByUser() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
  })
}

//   老版本的接口 查所有活动
export function findCampaignAllByUser() {
  return request({
    url: '/campaign/findCampaignAllByUser',
    method: 'get'
  })
}

export function getDownInfoByCurrentUser() {
  return request({
    url: '/login/getDownInfoByCurrentUser',
    method: 'get'
  })
}

export function findNextAgentByNow() {
  return request({
    url: '/organization/findNextAgentByNow',
    method: 'get'
  })
}

export function getListUsingByAgentid(obj) {
  return request({
    url: '/listManage/getListUsingByAgentid',
    method: 'get',
    params: obj
  })
}

export function getStaffNameByAgentId(obj) {
  return request({
    url: '/employee/getStaffNameByAgentId',
    method: 'get',
    params: obj
  })
}
