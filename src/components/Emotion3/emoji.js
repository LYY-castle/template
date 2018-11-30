import data from './emoji-data.js'
let emojiData = {}
Object.values(data).forEach(item => {
  emojiData = { ...emojiData, ...item }
})

/**
 *
 *
 * @export
 * @param {string} value
 * @returns {string}
 */

export function emoji(value) {
  if (!value) return
  Object.keys(emojiData).forEach(item => {
    value = value.replace(new RegExp(item, 'g'), createIcon(item))
  })
  return value
}

export function emoji1(value) {
  if (!value) return
  Object.keys(emojiData).forEach(item => {
    value = value.replace(new RegExp(item, 'g'), createIcon1(item))
  })
  return value
}

function createIcon(item) {
  const value = emojiData[item]
  const path = './static/emoji/'
  return `<img src="${path}${value}" align="middle" width="26px" height="26px" alt="${item}">`
}

function createIcon1(item) {
  const value = emojiData[item]
  const path = './static/emoji/'
  return `<img src="${path}${value}" align="middle" width="26px" height="26px">`
}

