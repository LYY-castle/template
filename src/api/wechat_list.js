import request from '@/utils/request'

export function queryCustomerInfo(customerId) {
  return request({
    url: '/customer/customerinfos',
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

export function generateRecordId(taskId, contactType) {
  return request({
    url: '/contact/generateRecordId',
    method: 'post',
    data: {
      taskId: taskId,
      contactType: contactType
    }
  })
}

export function queryContactRecordByTaskIdandStatus(taskId) {
  return request({
    url: '/dialtask/queryRecordByTaskIdAndStatus',
    method: 'get',
    params: {
      taskId: taskId
    }
  })
}

export function hasOrderInfos(campaignId) {
  return request({
    url: '/product/findAllProductByCampaignId',
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

export function getCampaignType(campaignId) {
  return request({
    url: '/campaign/findCampaignById',
    method: 'post',
    data: {
      id: campaignId
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

// 通过多个产品id查找响应产品信息
export function getProducts(obj) {
  return request({
    url: '/product/getProducts',
    method: 'post',
    data: obj
  })
}
// 批量生成产品
export function batchCreatProduct(obj) {
  return request({
    url: '/product/batchCreatProduct',
    method: 'post',
    data: obj
  })
}
// 多产品生成订单
export function addMoreOrder(obj) {
  return request({
    url: '/order/addMoreOrder',
    method: 'post',
    data: obj
  })
}
// 修改库存
export function modifyProduct(obj) {
  return request({
    url: '/product/modifyProductNum',
    method: 'post',
    data: obj
  })
}
// 发送消息
export function sendMsgTo(obj) {
  return request({
    url: '/wechat/sendMsgTo',
    method: 'post',
    data: obj
  })
}

// 综合查询聊天记录
export function queryRecords(customerId, pageNo) {
  return request({
    url: '/wechat/queryRecords',
    method: 'post',
    data: {
      customerId: customerId,
      pageNo: pageNo
    }
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

// 修改消息为已读
export function changeRecords(messageIds) {
  return request({
    url: '/wechat/records ',
    method: 'post',
    data: {
      messageIds: messageIds,
      readStatus: 1
    }
  })
}

// 查询所有微信客户
export function getWechatCustomer(staffId) {
  return request({
    url: '/dialtask/binded/wechat',
    params: {
      staffId: staffId,
      status: '0,1'
    }
  })
}

// 查询客户对应的未读消息数量
export function getUnreadNum(staffId) {
  return request({
    url: `/wechat/${staffId}/customer/statistics`,
    method: 'post'
  })
}
