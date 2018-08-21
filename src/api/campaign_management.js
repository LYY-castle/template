import request from '@/utils/request'

// 查询
export function queryCampaign(req) {
  return request({
    url: `/campaign/queryCampaignByCondetions`,
    method: 'post',
    data: req
  })
}
// 查询活动详情
export function findCampaignById(req) {
  return request({
    url: `/campaign/findCampaignById`,
    method: 'post',
    data: { id: req }
  })
}
// 删除活动
export function delCampaignById(campaignId) {
  return request({
    url: `/campaign/delCampaignById`,
    method: 'post',
    data: campaignId
  })
}
// 添加活动
export function addCampaign(req) {
  return request({
    url: `/campaign/addCampaign`,
    method: 'post',
    data: req
  })
}
// 批量删除活动
export function delCampaigns(campaignIds) {
  return request({
    url: '/campaign/delCampaigns',
    method: 'post',
    data: { campaignIds: campaignIds }
  })
}

// 添加名单请求
// 查询已选名单列表
export function showNameListsById(campaignId) {
  return request({
    url: '/campaign/showNameListsById',
    method: 'get',
    params: campaignId
  })
}
// 查询可选名单列表
export function findNameListExcludeById(searchReq) {
  return request({
    url: 'campaign/findNameListExcludeCampaignId',
    method: 'get',
    params: searchReq
  })
}
// 提交添加名单
export function assignCampaignAndList(addNameList) {
  return request({
    url: 'campaign/assignCampaignAndList',
    method: 'post',
    data: addNameList
  })
}
// 活动移除名单
export function removeList(campaignId, listIds) {
  return request({
    url: '/campaign/removeList',
    method: 'post',
    data: { 'campaignId': campaignId, 'listIds': listIds }
  })
}
