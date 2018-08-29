import request from '@/utils/request'
/** 默认进入页面查询当天接触情况 */
export function findContactHistory() {
  return request({
    url: '/contact/findContactHistory',
    method: 'get'
  })
}
/** 按时间查询话务情况 */
export function findTotalContactByTime(obj) {
  return request({
    url: '/contact/findTotalContactByTime',
    method: 'get',
    params: { 'time': obj }
  })
}
