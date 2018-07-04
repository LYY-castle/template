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

export function findAccountByAgentid(obj) {
  return request({
    url: '/account/findAccountByAgentid',
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

export function getRoleList() {
  return request({
    url: '/authority/getRoleList',
    method: 'get'
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

