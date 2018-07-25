import request from '@/utils/request'

export function getAllDirectory() {
  return request({
    url: '/knowledgeBaseController/getAllDirectory',
    method: 'get'
  })
}

export function addDirectory(obj) {
  return request({
    url: '/knowledgeBaseController/addDirectory',
    method: 'post',
    data: obj
  })
}

export function findContactHistory() {
  return request({
    url: '/contact/findContactHistory',
    method: 'get'
  })
}
