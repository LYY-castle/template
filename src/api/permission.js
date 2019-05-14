import request from '@/utils/request'

// 坐席权限
export function permsStaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-/GET',
    method: 'get'
  })
}

// 班组长权限
export function permsDepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-/GET',
    method: 'get'
  })
}

// 质检主管权限
export function permsQCDepart(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-qc-depart-/GET',
    method: 'get'
  })
}

// 质检员权限
export function permsQCStaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-qc-staff-/GET',
    method: 'get'
  })
}

// 现场主管权限
export function permsManager(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-manager-/GET',
    method: 'get'
  })
}

// 人事权限
export function permsPersonnel(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-personnel-/GET',
    method: 'get'
  })
}

// 知识库update权限
export function permsKBUpdate(id) {
  return request({
    url: `auth/users/${id}/perms/-kb-update/POST`
  })
}

// 软电话
export function permsSoftPhone(agentId) {
  return request({
    url: '/auth/users/' + agentId + '/perms/-softbar-/GET',
    method: 'get'
  })
}

