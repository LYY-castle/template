import request from '@/utils/request'

export function findAllAccount(obj) {
  return request({
    url: '/account/findAllAccount',
    method: 'get',
    params: obj
  })
}

export function changeState(obj) {
  return request({
    url: '/account/changeState',
    method: 'post',
    data: obj
  })
}

export function queryDepts() {
  return request({
    url: '/employee/queryDepts',
    method: 'get'
  })
}

export function alterAccountList(obj) {
  return request({
    url: '/account/alterAccountList',
    method: 'post',
    data: obj
  })
}

export function resetPWDById(obj) {
  return request({
    url: '/account/resetPWDById',
    method: 'post',
    data: obj
  })
}
// 角色建议
export function findStaffById(obj) {
  return request({
    url: '/employee/queryone',
    method: 'get',
    params: obj
  })
}

export function findOrganById(obj) {
  return request({
    url: '/organization/findOrganById',
    method: 'post',
    data: obj
  })
}

export function readProp(obj) {
  return request({
    url: '/account/readProp',
    method: 'get',
    params: obj
  })
}

export function modifyAccount(obj) {
  return request({
    url: '/account/modifyAccount',
    method: 'post',
    data: obj
  })
}

export function addAccount(obj) {
  return request({
    url: '/account/addAccount',
    method: 'post',
    data: obj
  })
}

export function findAllOrganTo() {
  return request({
    url: '/organization/findAllOrganTo',
    method: 'get'
  })
}

// 查询角色列表
export function getRoles() {
  return request({
    url: 'auth/roles'
  })
}
// 查询角色菜单
export function getMenuById(roleId) {
  return request({
    url: `auth/role/${roleId}/menus`
  })
}
// 赋予用户角色
export function addRole(data) {
  return request({
    url: `auth/users/roles`,
    method: 'post',
    data: data
  })
}
// 修改用户角色
export function editRole(accountNo, roleIds) {
  return request({
    url: `auth/users/roles`,
    method: 'post',
    data: { 'roleIds': roleIds, 'accountNo': accountNo, 'method': 'PUT' }
  })
}
// 查询用户角色
export function getUserRole(userId) {
  return request({
    url: `auth/users/${userId}/roles`
  })
}
// 查询员工
export function queryStaff(page) {
  return request({
    url: '/employee/query',
    method: 'get',
    params: page
  })
}
