import request from '@/utils/request'

export function queryByKeyWords(req) {
  return request({
    url: '/order/goquery',
    method: 'get',
    params: req
  })
}

export function getAllCamps() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
  })
}

export function queryByOrderId(orderId) {
  return request({
    url: '/order/quertDetail',
    method: 'get',
    params: { orderId: orderId }
  })
}

export function checkEditOrder(orderDetail) {
  return request({
    url: '/order/modifyorder',
    method: 'post',
    data: {
      orderId: orderDetail.orderId,
      customerName: orderDetail.customerName,
      customerPhone: orderDetail.customerPhone,
      description: orderDetail.description
    }
  })
}

export function deleteOrderById(deleteReq) {
  return request({
    url: '/order/deleteOrderById',
    method: 'get',
    params: { orderId: deleteReq.orderId }
  })
}

export function sendMessageToCustomer(sendMessage) {
  return request({
    url: '/message/sendOrderMessage',
    method: 'post',
    data: {
      orderId: sendMessage.orderId,
      phone: sendMessage.phone
    }
  })
}
