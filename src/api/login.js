import request from '@/utils/request'
import md5 from 'js-md5'

export function login(username, password, extensionNumber) {
  return request({
    url: '/login/checkpw',
    method: 'post',
    data: {
      userName: username + '',
      password: md5(password),
      DN: extensionNumber
    }
  })
}

export function loginAnd(username, password) {
  return request({
    url: '/login/loginOutAndLogin',
    method: 'post',
    data: {
      userName: username + '',
      password: md5(password)
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/loginOut',
    method: 'post'
  })
}

export function loginValid() {
  return request({
    url: '/login/loginValid',
    method: 'post'
  })
}

