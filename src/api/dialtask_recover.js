import request from '@/utils/request'

export function getAgentsByDeptId(departId) {
  return request({
    url: '/organization/getAgentsByDeptId',
    method: 'get',
    params: { departId: departId }
  })
}

export function recoverAndTransfer(paramsMap) {
  return request({
    url: '/contact/reNewContactTasks',
    method: 'post',
    data: paramsMap
  })
}
