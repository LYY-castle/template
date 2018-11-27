import request from '@/utils/request'

export function addBaseLawConfig(obj) { // 新增基本法配置
  return request({
    url: '/salary/baseLaw/settings',
    method: 'post',
    data: obj
  })
}
export function delBaseLawConfig(obj, list) { // 删除基本法配置
  return request({
    url: `/salary/baseLaw/settings/delete?setting_ids=${list}`,
    method: 'post',
    data: obj
  })
}
export function updateBaseLawConfig(setting_id, obj) { // 修改基本法配置
  return request({
    url: `/salary/baseLaw/settings/${setting_id}`,
    method: 'post',
    data: obj
  })
}
export function searchInfo(obj) { // 查询基本法列表
  return request({
    url: '/salary/baseLaw/settings',
    method: 'get',
    params: obj
  })
}
export function queryOne(obj) { // 按配置id查询相应配置关系
  return request({
    url: `/salary/baseLaw/settings/${obj}`,
    method: 'get',
    params: null
  })
}
export function batchSetEnabled(obj, status) { // 批量可见与不可见
  return request({
    url: `/salary/baseLaw//enable_disable/settings?setting_ids=${obj}&enabled=${status}`,
    method: 'post',
    data: null
  })
}

