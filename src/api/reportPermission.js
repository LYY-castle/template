import request from '@/utils/request'

export function permsdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-cti-report/GET',
    method: 'get'
  })
}

export function permsstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-cti-report/GET',
    method: 'get'
  })
}

export function permsobdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-ob-report/GET',
    method: 'get'
  })
}

export function permsobstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-ob-report/GET',
    method: 'get'
  })
}

export function permsorderdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-order-report/GET',
    method: 'get'
  })
}

export function permsorderstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-order-report/GET',
    method: 'get'
  })
}
