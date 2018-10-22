import request from '@/utils/request'
export function findAllCampaigns() {
  return request({
    url: '/campaign/findCampaigns',
    method: 'get'
  })
}
export function queryNoVisitCustomers(obj) {
  return request({
    url: '/contact/getBlackList',
    method: 'post',
    data: obj
  })
}
// 批量修改免访客户可见属性
export function batchSetVisible(obj) {
  return request({
    url: '/contact/batchsetvisible',
    method: 'post',
    data: { 'blacklistList': obj }
  })
}
export function addNoVisitCustomers(obj) {
  return request({
    url: '/contact/addBlackListInfo',
    method: 'post',
    data: obj
  })
}
export function batchDelete(obj) {
  return request({
    url: '/contact/delBlackListByIds',
    method: 'post',
    data: { 'ids': obj }
  })
}
export function getBlackListInfoById(obj) {
  return request({
    url: '/contact/getBlackListInfoById',
    method: 'get',
    params: { 'id': obj }
  })
}
export function editBlackListInfo(obj) {
  return request({
    url: '/contact/editBlackListInfo',
    method: 'post',
    data: obj
  })
}
export function delBlackListInfo(obj) {
  return request({
    url: '/contact/delBlackListInfo',
    method: 'post',
    data: { 'customerId': obj }
  })
}
