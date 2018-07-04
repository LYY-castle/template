import request from '@/utils/request'

export function queryByKeywords(req) {
  return request({
    url: '/dialtask/goquery',
    method: 'get',
    params: req
  })
}

export function isInNodisturbPhones(customerPhone) {
  return request({
    url: '/nodisturb/verifyPhone',
    method: 'post',
    data: {
      phone: customerPhone
    }
  })
}
