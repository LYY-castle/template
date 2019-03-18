import request from '@/utils/request'
// 按条件查找技能组
export function querySkillSetList(obj) {
  return request({
    url: '/employee/querySkillSetList',
    method: 'get',
    params: obj
  })
}
// 新增技能组
export function addSkillSet(obj) {
  return request({
    url: '/employee/addSkillSet',
    method: 'post',
    data: obj
  })
}
// 修改技能组
export function editSkillSet(obj) {
  return request({
    url: '/employee/editSkillSet',
    method: 'post',
    data: obj
  })
}
// 通过技能组id查询技能组
export function queryOne(obj) {
  return request({
    url: '/employee/queryOneSkillSet',
    method: 'get',
    params: obj
  })
}
// 通过技能组id伪删除技能组
export function hiddenOne(obj) {
  return request({
    url: '/employee/delNotSkillSet',
    method: 'post',
    data: obj
  })
}
// 通过技能组id真删除技能组
export function deleteOne(obj) {
  return request({
    url: '/employee/delYesSkillSet',
    method: 'post',
    data: obj
  })
}
// 通过技能组ids批量删除技能组
export function deleteBatch(obj) {
  return request({
    url: '/employee/delBatchSkillSet',
    method: 'post',
    data: obj
  })
}

