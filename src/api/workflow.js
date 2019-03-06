import request from '@/utils/request'
// userId用户id,processType流程状态（0在运行的流程，1历史流程）
export function findList(obj) {
  return request({
    url: '/workflow/list',
    method: 'get',
    params: obj
  })
}

// userId用户id,processName流程名称，processStatus流程状态
export function listDetail(obj) {
  return request({
    url: '/workflow/listDetail',
    method: 'get',
    params: obj
  })
}

// userId 用户id,processId流程id
export function queryOne(obj) {
  return request({
    url: '/workflow/queryOne',
    method: 'get',
    params: obj
  })
}

// 查看所有流程类型
export function queryStyle() {
  return request({
    url: '/workflow/queryStyle',
    method: 'get'
  })
}

