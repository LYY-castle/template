import request from '@/utils/request'
// 按条件查询
export function getTemplateList(obj) {
  return request({
    url: '/messageModule/getTemplateList',
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
export function addTemplateGroup(obj) {
  return request({
    url: '/messageModule/addTemplateGroup',
    method: 'post',
    data: obj

  })
}
// 修改
export function editTemplateGroup(obj) {
  return request({
    url: '/messageModule/editTemplateGroup',
    method: 'post',
    data: obj
  })
}
// 通过id查询
export function getTemplateListById(id) {
  return request({
    url: '/messageModule/getTemplateListById',
    method: 'post',
    data: { 'id': id }

  })
}
export function delTemplateGroup(id) {
  return request({
    url: '/messageModule/delTemplateGroup',
    method: 'post',
    data: { 'id': id }
  })
}
