import request from '@/utils/request'
// import qs from 'qs'

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
// 查询
export function queryCampaign(req) {
  return request({
    url: `/campaign/queryCampaignByCondetions`,
    method: 'post',
    params: req
  })
}
// 查询活动详情
export function findCampaignById(req) {
  return request({
    url: `/campaign/findCampaignById`,
    method: 'post',
    params: { id: req }
  })
}
// 删除活动
export function delCampaignById(campaignId) {
  return request({
    url: `/campaign/delCampaignById`,
    method: 'post',
    params: campaignId
  })
}
// 添加活动
export function addCampaign(req) {
  if (req.productIds.length !== 0) {
    req.productIds = req.productIds.join(',')
  } else {
    req.productIds = req.productIds.toString()
  }
  return request({
    url: `/campaign/addCampaign`,
    method: 'post',
    params: req
  })
}
// 批量删除活动
export function delCampaigns(campaignIds) {
  return request({
    url: '/campaign/delCampaigns',
    method: 'post',
    params: { campaignIds: campaignIds.join(',') }
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
  if (addNameList.listIds.length !== 0) {
    addNameList.listIds = addNameList.listIds.join(',')
  } else {
    addNameList.listIds = addNameList.listIds.toString()
  }

  return request({
    url: 'campaign/assignCampaignAndList',
    method: 'post',
    params: addNameList
  })
}
