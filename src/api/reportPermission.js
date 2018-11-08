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

export function permsmarkreportdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-mark-report/GET',
    method: 'get'
  })
}

export function permsmarkreportstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-mark-report/GET',
    method: 'get'
  })
}

export function permsqualityreportdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-quality-report/GET',
    method: 'get'
  })
}

export function permsqualityreportstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-quality-report/GET',
    method: 'get'
  })
}

export function permsDepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsqualityMonitorWorkingSet(id) { // 质检主管权限
  return request({
    url: '/auth/users/' + id + '/perms/-qc-depart-/GET',
    method: 'get'
  })
}

export function permsStaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsqualityOrdWorkingSet(id) { // 质检员权限
  return request({
    url: '/auth/users/' + id + '/perms/-qc-staff-/GET',
    method: 'get'
  })
}
