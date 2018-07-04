import request from '@/utils/request'

// 老版本调的接口存在分页
export function findAllNameList() {
  return request({
    url: '/nameList/findAllNameList',
    method: 'get'
  })
}

export function contactFindAllNameList() {
  return request({
    url: '/contact/findAllNameList',
    method: 'get'
  })
}

export function getListUsingByListId(obj) {
  return request({
    url: '/listManage/getListUsingByListId',
    method: 'get',
    params: obj
  })
}
