import request from '@/utils/request'

export function getStaffNameById(staffId) {
  return request({
    url: '/employee/getStaffNameByAgentId',
    method: 'get',
    params: {
      agentId: staffId
    }
  })
}

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

export function getSummaries(taskId) {
  return request({
    url: '/dialtask/getSummariesByTaskId',
    method: 'get',
    params: {
      taskId: taskId
    }
  })
}

export function getCampaignType(campaignId) {
  return request({
    url: '/campaign/findCampaignById',
    method: 'post',
    data: {
      id: campaignId
    }
  })
}

export function addNewProduct(selectedProduct) {
  return request({
    url: '/product/addProductNew',
    method: 'post',
    data: selectedProduct
  })
}

export function generateOrder(order_Params) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data: order_Params
  })
}

export function sendMessageToCustomer(orderId, phone) {
  return request({
    url: '/message/sendOrderMessage',
    method: 'post',
    data: {
      orderId: orderId,
      phone: phone
    }
  })
}

export function checkDialTimes(taskId) {
  return request({
    url: '/contact/checkContactTimes',
    method: 'get',
    params: {
      taskId: taskId
    }
  })
}

export function queryOneTask(taskId) {
  return request({
    url: '/dialtask/queryone',
    method: 'get',
    params: {
      taskId: taskId
    }
  })
}

export function updateTaskStatus(taskId, status, appointTime) {
  return request({
    url: '/dialtask/updateTaskStatus',
    method: 'post',
    data: {
      taskId: taskId,
      status: status,
      appointTime: appointTime
    }
  })
}

export function updateRecordInfo(recordId, taskStatus, nodules, noduledesc) {
  return request({
    url: '/dialtask/generateRecord',
    method: 'post',
    data: {
      recordId: recordId,
      taskStatus: taskStatus,
      nodules: nodules,
      noduledesc: noduledesc
    }
  })
}

export function getSummariesByAgentId(agentId) {
  return request({
    url: '/nodule/getNodulesByAgentId',
    method: 'get',
    params: {
      agentId: agentId
    }
  })
}
export function findCampaignByUser() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
  })
}
