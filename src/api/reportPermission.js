import request from '@/utils/request'

export function permsdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsobdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsobstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsorderdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsorderstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsmarkreportdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsmarkreportstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsresultreportdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

export function permsresultreportstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

export function permsqualityreportdepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-qc-depart-/GET',
    method: 'get'
  })
}

export function permsqualityreportstaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-qc-staff-/GET',
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
