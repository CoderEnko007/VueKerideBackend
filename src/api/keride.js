import request from '@/utils/request'

// export function getIntro() {
//   return request({
//     url: '/intro',
//     method: 'get'
//   })
// }

export const getIntro = () => { return request.get(`/intro`) }
export const updateIntro = params => { return request.patch(`/intro`, params)}
// export const getCategorys = () => { return request.get(`${host}${prefix}/categories`) };
// export const getProducts = params => { return request.get(`${host}${prefix}/products`, params) };
// // export const getProductDetail = id => { return request.get(`${host}${prefix}/products?id=${id}`) };
// export const getProductDetail = id => { return request.get(`${host}${prefix}/products/${id}`) };
// export const getNews = params => { return request.get(`${host}${prefix}/news`, params)};
// // export const getNewsDetail = id => { return request.get(`${host}${prefix}/news?id=${id}`)};
// export const getNewsDetail = id => { return request.get(`${host}${prefix}/news/${id}`)};
// export const getContacts = () => { return request.get(`${host}${prefix}/contacts`)};
// export const getPartner = () => { return request.get(`${host}${prefix}/partner`)};