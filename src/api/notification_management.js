import request from '@/utils/request'

export function queryByKeyWords(req) {
  return request({
    url: '/notification/queryByKeyWords',
    method: 'get',
    params: req
  })
}

export function getAllStaffs() {
  return request({
    url: '/employee/query',
    method: 'get'
  })
}

export function addNewNotification(newnotification, depts) {
  return request({
    url: '/notification/addNewNotification',
    method: 'post',
    data: {
      title: newnotification.title,
      body: newnotification.body,
      degree: newnotification.emergency_degree,
      is_recursive_dept: newnotification.is_recursive_dept,
      depts: depts
    }
  })
}

export function releaseNotification(notification_id) {
  return request({
    url: '/notification/releaseById',
    method: 'get',
    params: {
      id: notification_id
    }
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

export function editNotification(id, editnotification, depts) {
  return request({
    url: '/notification/editNotification',
    method: 'post',
    data: {
      notification_id: id,
      title: editnotification.title,
      body: editnotification.body,
      degree: editnotification.emergency_degree,
      is_recursive_dept: editnotification.is_recursive_dept,
      depts: depts
    }
  })
}

export function deleteOneNotification(notification_id) {
  return request({
    url: '/notification/deleteById',
    method: 'get',
    params: {
      notification_id: notification_id
    }
  })
}

export function recallNotification(notification_id) {
  return request({
    url: '/notification/recallById',
    method: 'get',
    params: {
      notification_id: notification_id
    }
  })
}
