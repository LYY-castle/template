import request from '@/utils/request'

export function queryByCampaign(req) {
  return request({
    url: '/quality/queryCampaignByCondetions',
    method: 'post',
    data: req
  })
}

export function queryByCampaignId(campaignId) {
  return request({
    url: '/campaign/findCampaignById',
    method: 'post',
    data: {
      id: campaignId
    }
  })
}

// 通过部门id获取部门信息
export function queryDeptById(deptId) {
  return request({
    url: '/employee/queryDepById',
    method: 'get',
    params: { organ_id: deptId }
  })
}

// 通过小结id获取小结信息
export function queryNodulesById(summaryId) {
  return request({
    url: '/nodule/findNoduleByNoduleId',
    method: 'post',
    data: {
      noduleId: summaryId
    }
  })
}
// 获得当前登录人部门下的所有质检部门信息
export function queryallQcdepts(departId) {
  return request({
    url: '/organization/getAllChildrenOrgan',
    method: 'get',
    params: {
      departId: departId
    }
  })
}
// 获得所有评分表
export function quertyAllMarks() {
  return request({
    url: '/quality/getAllMarks',
    method: 'get'
  })
}

// 根据活动id显示当前活动的质检部门
export function queryQcDeptByCampaignId(campaignId) {
  return request({
    url: '/quality/getDeptByCampaignId',
    method: 'get',
    params: {
      activityId: campaignId
    }
  })
}

// 根据活动id显示当前活动采用的评分表
export function queryGradeNamesByCampaignId(campaignId) {
  return request({
    url: '/quality/getMarksByCampaignId',
    method: 'get',
    params: {
      activityId: campaignId
    }
  })
}

// 完成指定
export function completeAssignGroupsAndGrades(assignParams) {
  return request({
    url: '/quality/completeAssign',
    method: 'post',
    data: {
      gradeIds: assignParams.grades,
      activityId: assignParams.activityId,
      activityName: assignParams.activityName,
      departId: assignParams.qcdeptId,
      departName: assignParams.qcdeptName
    }
  })
}
