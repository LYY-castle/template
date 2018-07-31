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

export function delDirectory(obj) {
  return request({
    url: '/knowledgeBaseController/delDirectory/' + obj.id,
    method: 'post'
  })
}

export function modifyDirectoryName(obj) {
  return request({
    url: '/knowledgeBaseController/modifyDirectoryName/' + obj.id,
    method: 'post',
    data: {
      name: obj.name
    }
  })
}
