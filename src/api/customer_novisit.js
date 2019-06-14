import request from '@/utils/request'
export function findAllCampaigns() {
  return request({
    url: '/campaign/findCampaigns',
    method: 'get'
  })
}
export function queryNoVisitCustomers(obj) {
  return request({
    url: '/blacklist/getBlackList',
    method: 'post',
    data: obj
  })
}
// 批量修改免访客户可见属性
export function batchSetVisible(obj) {
  return request({
    url: '/blacklist/batch/status',
    method: 'post',
    data: obj
  })
}
export function addNoVisitCustomers(obj) {
  return request({
    url: '/blacklist/addBlackListInfo',
    method: 'post',
    data: obj
  })
}
export function batchDelete(obj) {
  return request({
    url: '/blacklist/delBlackListByIds',
    method: 'post',
    data: { 'ids': obj }
  })
}
export function getBlackListInfoById(obj) {
  return request({
    url: '/blacklist/getBlackListInfoById',
    method: 'get',
    params: { 'id': obj }
  })
}
export function editBlackListInfo(obj) {
  return request({
    url: '/blacklist/editBlackListInfo',
    method: 'post',
    data: obj
  })
}
export function delBlackListInfo(obj) {
  return request({
    url: '/blacklist/delBlackListInfo',
    method: 'post',
    data: { 'customerId': obj }
  })
}
export function uploadFileandImport(multipartFile) {
  return request({
    url: '/blacklist/upload',
    method: 'post',
    data: multipartFile
  })
}

