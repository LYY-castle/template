import request from '@/utils/request'

export function firstIn(uid) {
  return request({
    url: `/note/users/${uid}/notes`,
    method: 'get',
    params: null
  })
}

export function queryByKeyWords(obj) {
  return request({
    url: '/note/users/' + obj.uid + '/search',
    method: 'get',
    params: obj
  })
}

export function addNotes(note_item, uid) {
  return request({
    url: `/note/add/users/${uid}/notes`,
    method: 'post',
    data: note_item
  })
}

export function getNoteDetail(noteid, uid) {
  return request({
    url: `/note/users/${uid}/notes/${noteid}`,
    method: 'get',
    params: null
  })
}

export function modifyNote(note_item, uid, noteid) {
  return request({
    url: `/note/edit/users/${uid}/notes/${noteid}`,
    method: 'post',
    data: note_item
  })
}

export function deleteOneNote(noteid, uid) {
  return request({
    url: `/note/del/users/${uid}/notes/${noteid} `,
    method: 'post',
    data: {}
  })
}
