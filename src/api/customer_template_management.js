import request from '@/utils/request'
// 查询所有
export function findAllTemplateMeta() {
  return request({
    url: `/customer/template/all`,
    method: 'get'
  })
}
// 通过id查询
export function findTemplateMetaById(id) {
  return request({
    url: `/customer/template/template`,
    method: 'get',
    params: id
  })
}
// 新增模板字段
export function addTemplateMeta(obj) {
  return request({
    url: `/customer/template/add`,
    method: 'post',
    data: obj
  })
}
// 修改模板字段
export function modifyTemplateMeta(obj) {
  return request({
    url: `/customer/template/update`,
    method: 'post',
    data: obj
  })
}
// 删除模板字段
export function delTemplateMeta(id) {
  return request({
    url: `/customer/template/template/` + id,
    method: 'post'
  })
}
// 删除模板字段
export function delTemplateMetas(ids) {
  return request({
    url: `/customer/template/ids`,
    method: 'post',
    data: ids
  })
}
// 条件查询
export function findMessageRecordList(obj) {
  return request({
    url: `/customer/template/list`,
    method: 'get',
    params: obj
  })
}
