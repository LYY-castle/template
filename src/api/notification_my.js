import request from '@/utils/request'

export function queryByKeyWords(req) {
  return request({
    url: '/notification/getMyMessages',
    method: 'get',
    params: req
  })
}

export function queryOneNotification(notification_id) {
  return request({
    url: '/notification/queryOneById',
    method: 'get',
    params: {
      notification_id: notification_id
    }
  })
}

export function updateReadStatus(notification_id) {
  return request({
    url: '/notification/updateReadStatus',
    method: 'get',
    params: {
      notification_id: notification_id
    }
  })
}
