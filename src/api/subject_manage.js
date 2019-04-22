import request from '@/utils/request'

export function querySynthesizeReq(req) {
  return request({
    url: 'questions/queryList',
    method: 'get',
    params: req
  })
}

export function queryQuestionsOne(req) {
  return request({
    url: 'questions/queryOne',
    method: 'get',
    params: {
      id: req
    }
  })
}

export function deleteQuestions(req) {
  return request({
    url: 'questions/delete',
    method: 'get',
    params: {
      idlist: req
    }
  })
}

export function addQuestions(req) {
  return request({
    url: 'questions/add',
    method: 'post',
    data: {
      userId: req.userId,
      context: req.context,
      type: req.type,
      useObject: req.useObject,
      complexity: req.complexity,
      sucAnswer: req.sucAnswer,
      errorAnswer: req.errorAnswer,
      isRight: req.isRight
    }
  })
}

export function uploadFileandImport(obj) {
  return request({
    url: `questions/upload`,
    method: 'post',
    data: obj
  })
}

export function updateQuestions(req) {
  return request({
    url: 'questions/update',
    method: 'post',
    data: {
      id: req.id,
      userId: req.userId,
      context: req.context,
      type: req.type,
      useObject: req.useObject,
      complexity: req.complexity,
      sucAnswer: req.sucAnswer,
      errorAnswer: req.errorAnswer,
      isRight: req.isRight
    }
  })
}
