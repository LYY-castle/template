import request from '@/utils/request'
// 根据条件查询
export function findTemplateList(obj) {
  return request({
    url: '/messageModule/findTemplateList',
    method: 'post',
    data: obj
  })
}
// 查询所有
export function getAllTemplateGroup() {
  return request({
    url: '/messageModule/getAllTemplateGroup',
    method: 'get'
  })
}
// 新增
export function addTemplate(obj) {
  return request({
    url: '/messageModule/addTemplate',
    method: 'post',
    data: obj
  })
}
// 根据id查询
export function getTemplateById(id) {
  return request({
    url: '/messageModule/getTemplateById',
    method: 'post',
    data: { 'id': id }
  })
}
// 修改
export function editTemplate(obj) {
  return request({
    url: '/messageModule/editTemplate',
    method: 'post',
    data: obj
  })
}
// 删除
export function delTemplate(id) {
  return request({
    url: '/messageModule/delTemplate',
    method: 'post',
    data: { 'id': id.toString() }
  })
}
// 批量删除
export function delTemplateList(ids) {
  return request({
    url: '/messageModule/delTemplateList',
    method: 'post',
    data: { 'chk_box': ids }
  })
}
