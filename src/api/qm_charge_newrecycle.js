import request from '@/utils/request'

// 初始化分配对象
export function getDownInfoByCurrentUser() {
  return request({
    url: '/login/getDownInfoByCurrentUser',
    method: 'get'
  })
}
// 查询所有的活动
export function findQmCampaignByUser() {
  return request({
    url: 'qualityTask/findQmCampaignByUser',
    method: 'get'
  })
}
// 查询活动下名单的分配情况
export function queryMainQualityList(req) {
  return request({
    url: 'qualityTask/queryMainQualityList',
    method: 'get',
    params: req
  })
}
//  查询所选名单的分配情况
export function showTaskAssignInfo(req) {
  return request({
    url: 'qualityTask/showTaskAssignInfo',
    method: 'post',
    data: req
  })
}
// 确定分配名单
export function recycleQualityTaskInfo(req) {
  return request({
    url: 'qualityTask/recycleQualityTaskInfo',
    method: 'post',
    data: req
  })
}
