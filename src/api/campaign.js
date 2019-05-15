import request from '@/utils/request'

// 获取所有的产品
export function findAllProduct() {
  return request({
    // url: `/productServer/findAllProduct`,
    url: `/product/findAllProduct`,
    method: 'get'
  })
}

// 获取所有活动部门
export function queryDepts() {
  return request({
    url: `employee/queryDepts`,
    method: 'get'
  })
}

// 获取所有可见部门
export function getAllVisibleDepts() {
  return request({
    url: '/organization/findAllOrganTo',
    method: 'get'
  })
}

// 获取所有小结
export function findAllNodules() {
  return request({
    url: `nodule/findAllNodules`,
    method: 'get',
    params: {
      type: 0
    }
  })
}

// 获取所有可见小结
export function findAllVisibleNodules() {
  return request({
    url: `nodule/findAllVisibleNodules`,
    method: 'get'
  })
}

// 获取活动类型
export function findAllCampaignTypes() {
  return request({
    url: 'campaign/getAllCampaignTypes',
    method: 'get'
  })
}

// 根据活动id获取评分表
export function findMarksByCampaignId(campaignId) {
  return request({
    url: `quality/getMarksByCampaignId`,
    method: 'get',
    params: {activityId: campaignId}
  })
}

// 根据活动id获取质检部门
export function findDeptByCampaignId(campaignId) {
  return request({
    url: `quality/getDeptByCampaignId`,
    method: 'get',
    params: {activityId: campaignId}
  })
}

// 修改活动
export function modifyCampaign(req) {
  return request({
    url: `campaign/modifyCampaign`,
    method: 'post',
    data: req
  })
}

// 启用活动
export function changeCampaignStatus(req) {
  return request({
    url: 'campaign/changeCampaignStatus',
    method: 'post',
    data: req
  })
}
