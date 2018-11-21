import request from '@/utils/request'

export function findAllAccount(obj) {
  return request({
    url: '/account/findAllAccount',
    method: 'get',
    params: obj
  })
}

