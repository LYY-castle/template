import request from '@/utils/request'

// 老版本调的接口存在分页
export function findNextOrganByNow() {
  return request({
    url: '/organization/findNextOrganByNow',
    method: 'get'
  })
}

export function getListUsingByOrganId(obj) {
  return request({
    url: '/listManage/getListUsingByOrganId',
    method: 'get',
    params: obj
  })
}
