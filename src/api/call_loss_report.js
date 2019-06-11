import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'

// 通过员工id查找技能组
export function querySkillList() {
  return request({
    url: '/employee/querySkillSetList',
    method: 'get',
    params: { 'pageable': false }
  })
}

export function countCallLossTimes(req) {
  return requestV2({
    url: '/report/ctireport/call_loss/statistics',
    method: 'get',
    params: req
  })
}
