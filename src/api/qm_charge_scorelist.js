import request from '@/utils/request'
/** 根据评分表名操作人和操作时间查询评分表 */
export function findAllGradeForm(obj) {
  return request({
    url: '/grade/findAllGradeForm',
    method: 'get',
    params: obj
  })
}
/** 根据评分表id单个删除评分表 */
export function deleteGradeFormByGradeId(obj) {
  return request({
    url: '/grade/deleteGradeFormByGradeId',
    method: 'post',
    data: obj
  })
}
/** 根据评分表数组批量删除评分表 */
export function deleteGradeFormByTeam(obj) {
  return request({
    url: '/grade/deleteGradeFormByTeam',
    method: 'post',
    data: obj
  })
}
/** 根据评分表id查询评分表详情 */
export function getGradeByGradeId(obj) {
  return request({
    url: '/grade/getGradeByGradeId',
    method: 'get',
    params: obj
  })
}
/** 添加评分表 */
export function addGrade(obj) {
  return request({
    url: '/grade/addGrade',
    method: 'post',
    data: obj
  })
}
/** 修改评分表 */
export function editGrade(obj) {
  return request({
    url: '/grade/editGrade',
    method: 'post',
    data: obj
  })
}
