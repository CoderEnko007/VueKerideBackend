/**
 * Created by jiachenpan on 16/11/18.
 */
import lrz from 'lrz'

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
export function checkNumber(theObj) {
  let reg = /^[0-9]+.?[0-9]*$/;
  return reg.test(theObj);

}

export function isValidPost( chars ) {
  let re=/^\d{6}$/;
  return chars.match(re) != null;
}

export function isEmail(str){
  let re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  return re.test(str) === true;
}

export function resizeImage(file, opts) {
  const config = {
    width: null,
    height: null,
    quality: 0.7,
    filename: 'file'
  };
  opts = opts || {};
  for (let p in opts) {
    if (!opts.hasOwnProperty(p)) continue;
    config[p] = opts[p]
  }
  return lrz(file, {width: config.width, height: config.height, quality: config.quality, filename: config.filename})
}

export function strDisCode(str) {
  str = str.replace(/&nbsp;/g,'\xa0')
  str = str.replace(/&Uuml;/g, '\xdc')
  str = str.replace(/&uuml;/g, '\xfc')
  str = str.replace(/&Ouml;/g, '\xd6')
  str = str.replace(/&ouml;/g, '\xf6')
  str = str.replace(/&Aring;/g, '\xc5')
  str = str.replace(/&aring;/g, '\xe6')

  return str
}

// export const resizeImage
