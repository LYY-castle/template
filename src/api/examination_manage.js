import request from '@/utils/request'

export function querySynthesizeReq(req) {
  return request({
    url: 'testPapers/queryList',
    method: 'get',
    params: req
  })
}

export function generateReq(req, userId) {
  return request({
    url: 'testPapers/generateTestPapers',
    method: 'get',
    params: {
      name: req.testPapersName,
      complexity: req.complexity,
      useObject: req.useObject,
      userId: userId
    }
  })
}


export function submitTestPaperReq(singleItems, judgeItems, multiItems, userId, testPapersId, judge) {
  return request({
    url: 'testPapers/submitTestPaper',
    method: 'post',
    data: {
      testPapersId: testPapersId,
      userId: userId,
      singleItems: singleItems,
      judgeItems: judgeItems,
      multiItems: multiItems,
      judge: judge
    }
  })
}

export function getTestPapersRecordReq(testPapersId, judge) {
  return request({
    url: '/answerRecord/getHistoryTestPapers',
    method: 'get',
    params: {
      testPapersId: testPapersId,
      judge: judge
    }
  })
}

