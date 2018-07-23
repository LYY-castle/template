import request from '@/utils/request'

export function queryByKeywords(req) {
  return request({
    url: '/dialtask/goquery',
    method: 'get',
    params: req
  })
}

export function isInNodisturbPhones(customerPhone) {
  return request({
    url: '/nodisturb/verifyPhone',
    method: 'get',
    params: {
      phone: customerPhone
    }
  })
}

export function showDetailInfosByTaskId(taskId) {
  return request({
    url: '/dialtask/queryone',
    method: 'get',
    params: {
      taskId: taskId
    }
  })
}

export function queryCustomerInfo(customerId) {
  return request({
    url: '/customer/querycustomerbyid',
    method: 'get',
    params: {
      customerId: customerId
    }
  })
}

export function queryContactRecord(taskId, campaignId) {
  return request({
    url: '/dialtask/queryrecordbytaskid',
    method: 'get',
    params: {
      taskId: taskId,
      campaignId: campaignId
    }
  })
}

export function hasOrderInfos(campaignId) {
  return request({
    url: '/productServer/findAllProductByCampaignId',
    method: 'get',
    params: {
      campaignId: campaignId
    }
  })
}

export function getSummaries(campaignId) {
  return request({
    url: '/dialtask/getSummariesByCampaignId',
    method: 'get',
    params: {
      campaignId: campaignId
    }
  })
}
