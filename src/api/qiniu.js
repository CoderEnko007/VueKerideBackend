import request from '@/utils/request'
import axios from 'axios'

export const config = {
  domain: 'https://upload-z2.qiniup.com',
  qiniuaddr: 'pao2w9stm.bkt.clouddn.com',
  headers: {'Content-Type': 'multipart/form-data'}
}

export function getToken(token) {
  return request({
    url: '/token',
    method: 'get',
    token: token
  })
}

export function upload(formData) {
  return axios.post(config.domain, formData, config.headers)
}
