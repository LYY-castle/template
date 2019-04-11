import request from '@/utils/request'
/** 通过条件查找质检任务完成情况*/
export function findQualityTaskByInfo(req) {
  return request({
    url: '/quality/findQualityTaskByInfo',
    method: 'get',
    params: req
  })
}
/** 根据任务id显示当前任务采用的评分表 */
export function getMarksByTaskId(req) {
  return request({
    url: '/quality/getMarksByTaskId',
    method: 'get',
    params: req
  })
}
/** 通过评分表id获取评分表内容*/
export function getGradeListByGradeId(req) {
  return request({
    url: '/grade/getGradeListByGradeId',
    method: 'get',
    params: req
  })
}
/** 通过评分记录获取接触记录 */
export function getContactByGradeId(req) {
  return request({
    url: '/contact/getContactByGradeId',
    method: 'get',
    params: req
  })
}
/** 通过客户id获取客户详情 */
export function querycustomerbyid(req) {
  return request({
    url: '/customer/customerinfos',
    method: 'get',
    params: req
  })
}
/** 通过接触任务id和活动id获取接触历史 */
export function queryrecordbytaskid(req) {
  return request({
    url: '/dialtask/queryrecordbytaskid',
    method: 'get',
    params: req
  })
}
/** 条件查找订单情况 */
export function queryOrder(req) {
  return request({
    url: '/order/queryOrder',
    method: 'get',
    params: req
  })
}
/** 添加质检评分记录 */
export function addQCGradeRecord(req) {
  return request({
    url: '/grade/addQCGradeRecord',
    method: 'post',
    data: req
  })
}
/** 修改质检评分记录 */
export function editQCGradeRecord(req) {
  return request({
    url: '/grade/editQCGradeRecord',
    method: 'post',
    data: req
  })
}
/** 通过评分表id获取评分表 */
export function getGradeByGradeId(req) {
  return request({
    url: '/grade/getGradeByGradeId',
    method: 'get',
    params: req
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

/** 和谐字符串 */
export function repalceString(string, start, length, str) { // string:需要替换的字符串，start:从第几个开始，length:替换几个，str:用什么替换
  var len = string.length
  if (len <= start) { // 如果原字符串长度小于或者等于开始位置,那么返回原字符串
    return string
  }
  var temp = ''
  if (len > start && len < start + length) { // 如果原字符串长度介于 起始位 和 起始位与替换个数之和 之间，那么替换后续字符串，有多少替换多少
    for (var i = 0; i < len - start + 1; i++) {
      temp += str
    }
    return string.substring(0, start - 1) + temp
  }
  if (len >= start + length) { // 如果原字符串长度大于起始位与替换个数之和，则为中间替代
    for (var j = 0; j < length; j++) {
      temp += str
    }
    return string.substring(0, start - 1) + temp + string.substring(start + length - 1, len)
  }
}
