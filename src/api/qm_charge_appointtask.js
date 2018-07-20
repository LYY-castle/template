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
// 通过活动和部门查询改部门（下属人员或部门）名单分配情况
export function countTaskAssignInfo(req) {
  return request({
    url: 'qualityTask/countTaskAssignInfo',
    method: 'post',
    data: req
  })
}
// 确定分配名单
export function assignQualityTaskInfo(req) {
  return request({
    url: 'qualityTask/assignQualityTaskInfo',
    method: 'post',
    data: req
  })
}
