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
