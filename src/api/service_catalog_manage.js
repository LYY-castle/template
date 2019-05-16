// import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'

// 加载所有服务
export function getAllServer() {
  return requestV2({
    url: '/workflow/servicemenu/getList',
    method: 'get'
  })
}

// 添加服务
export function addServer(obj) {
  return requestV2({
    url: '/workflow/servicemenu/add',
    method: 'post',
    data: obj
  })
}

// 修改服务
export function modifyServer(obj) {
  return requestV2({
    url: '/workflow/servicemenu/update',
    method: 'post',
    data: obj
  })
}

// 删除服务
export function deleteServer(serverId) {
  return requestV2({
    url: '/workflow/servicemenu/delete',
    method: 'get',
    params: {
      id: serverId
    }
  })
}
// 获取单个数据详情
export function queryOne(serverId){
  return requestV2({
    url:'/workflow/servicemenu/getOne',
    method: 'get',
    params:{
      id: serverId
    }
  })
}
// 服务名校验是否与已有服务重复
export function checkServerName(serviceName) {
  return requestV2({
    url: '/workflow/servicemenu/existServiceName',
    params: serviceName
  })
}

// 获取所有工单模板
export function getTemplate() {
  return requestV2({
    url: '/workflow/workforms',
    method: 'get'
  })
}