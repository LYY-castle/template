// import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'

// 加载所有服务
export function getAllServer() {
  return requestV2({
    url: '/workflow/workflow/servicemenu/getList',
    method: 'get'
  })
}

// 添加服务
export function addServer(obj) {
  return requestV2({
    url: '/workflow/workflow/serviceMenu/add',
    method: 'post',
    data: obj
  })
}

// 修改服务
export function modifyServer(obj) {
  return requestV2({
    url: '/workflow/workflow/serviceMenu/update',
    method: 'patch',
    data: obj
  })
}

// 删除服务
export function deleteServer(serverId) {
  return requestV2({
    url: '/workflow/workflow/serviceMenu/delete',
    method: 'delete',
    params: serverId
  })
}

// 服务名校验是否与已有服务重复
export function checkServerName(serviceName) {
  return requestV2({
    url: '/workflow/workflow/serviceMenu/existServiceName',
    params: serviceName
  })
}