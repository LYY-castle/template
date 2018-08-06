import request from '@/utils/request'

export function firstIn(uid) {
  return request({
    url: '/note/getAllNotes',
    method: 'get',
    params: {
      uid: uid
    }
  })
}

export function queryByKeyWords(req) {
  return request({
    url: '/note/getNoteByInfo',
    method: 'post',
    data: req
  })
}

export function addNotes(note_item, uid) {
  return request({
    url: '/note/addNote',
    method: 'post',
    data: {
      note_item: note_item,
      uid: uid
    }
  })
}

export function getNoteDetail(noteid, uid) {
  return request({
    url: '/note/findNoteByNoteId',
    method: 'post',
    data: {
      noteid: noteid,
      uid: uid
    }
  })
}

export function modifyNote(note_item, uid, noteid) {
  return request({
    url: '/note/editNote',
    method: 'post',
    data: {
      note_item: note_item,
      uid: uid,
      noteid: noteid
    }
  })
}

export function deleteOneNote(noteid, uid) {
  return request({
    url: '/note/delNoteByNoteId',
    method: 'post',
    data: {
      noteid: noteid,
      uid: uid
    }
  })
}
