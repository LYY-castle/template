import request from '@/utils/request'
// 查询主题信息
export function getCurrentTheme() {
  return request({
    url: `/themeandcolor/getCurrentTheme`
  })
}
// 修改主题信息
export function modifyTheme(req) {
  return request({
    url: `/themeandcolor/modifyTheme`,
    method: 'post',
    data: req
  })
}
