import request from '@/utils/request'

// 查询质检活动 查询下属所有活动时传入campaignId
export function findQmCampaignByUser(campaignId) {
  return request({
    url: 'qualityTask/findQmCampaignByUser',
    params: campaignId
  })
}
// 查询所有质检活动
export function findAllCampaign() {
  return request({
    url: 'campaign/findAllCampaign'
  })
}
// 查询案例
export function getGradeRecordList(req) {
  return request({
    url: '/quality/gradeRecordList',
    params: req
  })
}
