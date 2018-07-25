import request from '@/utils/request'

export function findAssignDownNamelistInfoByCampaignAndDepart(obj) {
  return request({
    url: '/campaign/findAssignDownNamelistInfoByCampaignAndDepart',
    method: 'get',
    params: obj
  })
}

export function recycleTaskInfo(obj) {
  return request({
    url: '/nameList/recycleTaskInfo',
    method: 'post',
    data: obj
  })
}
