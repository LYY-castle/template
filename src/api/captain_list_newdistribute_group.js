import request from '@/utils/request'

export function findCampaignNameListAssignInfo(obj) {
  return request({
    url: '/campaign/findCampaignNameListAssignInfo',
    method: 'get',
    params: obj
  })
}

export function findDownNamelistInfoByCampaignAndDepart(obj) {
  return request({
    url: '/campaign/findDownNamelistInfoByCampaignAndDepart',
    method: 'get',
    params: obj
  })
}

export function assignTaskInfo(obj) {
  return request({
    url: '/nameList/assignTaskInfo',
    method: 'post',
    data: obj
  })
}
