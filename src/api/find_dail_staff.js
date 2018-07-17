import request from '@/utils/request'

export function getAllCamps() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
  })
}

export function queryByKeyWords(req) {
  return request({
    url: '/contact/getContactList',
    method: 'post',
    data: {
      campaigns: req.campaign,
      customerName: req.customerName,
      caller: req.caller,
      callee: req.callee,
      startTime: req.startTime,
      endTime: req.endTime,
      stime: req.stime,
      etime: req.etime,
      currentPage: req.pageNo,
      departId: null
    }
  })
}
