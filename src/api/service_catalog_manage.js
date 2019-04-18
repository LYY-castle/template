import request from '@/utils/request'

// 加载所有服务
export function getAllServer(campaignId) {
  return request({
    url: '',
    params: campaignId
  })
}

// 添加服务
export function addServer(obj) {
  return request({
    url: 'workflow/serviceMenu/add',
    method: 'post',
    data: obj
  })
}

// 修改服务
export function modifyServer(obj) {
  return request({
    url: 'workflow/serviceMenu/update',
    method: 'patch',
    data: obj
  })
}

// 删除服务
export function deleteServer(serverId) {
  return request({
    url: 'workflow/serviceMenu/delete',
    method: 'delete',
    params: serverId
  })
}

// 服务名校验是否与已有服务重复
export function getServerList(serviceName) {
  return request({
    url: 'workflow/serviceMenu/existServiceName',
    params: serviceName
  })
}