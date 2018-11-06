import request from '@/utils/request'

export function findQualityTaskByInfo(obj) { // 根据接触历史编号、任务名称、质检员工号、任务完成情况、分配时间来查询质检任务
  return request({
    url: '/quality/findQualityTaskByInfo',
    method: 'get',
    params: obj
  })
}

export function findQCTaskByQCId(obj) { // 通过质检工号来查询质检员的任务情况
  return request({
    url: '/quality/findQCTaskByQCId',
    method: 'get',
    params: obj
  })
}

export function findGradeByDepartIds(obj) { // 通过部门id查询该部门质检员任务完成总体情况
  return request({
    url: '/quality/findGradeByDepartIds',
    method: 'get',
    params: obj
  })
}
// 查找部门员工
export function getStaffByDepartId(id) {
  return request({
    url: '/employee/getStaffByDepartId',
    method: 'get',
    params: { 'departId': id }
  })
}
