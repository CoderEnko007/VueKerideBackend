import request from '@/utils/request'

// export function getIntro() {
//   return request({
//     url: '/intro',
//     method: 'get'
//   })
// }

export const getIntro = () => { return request.get(`/intro`) }
export const updateIntro = params => { return request.patch(`/intro`, params) }

export const getCategory = () => { return request.get(`/categories`) }
export const createCategory = params => { return request.post(`/categories`, params) }
export const updateCategory = params => { return request.patch(`/categories`, params) }
export const deleteCategory = id => { return request.delete(`/categories/${id}`) }

export const getProducts = params => { return request.get(`/products`, {params: params}) }
export const createProduct = params => { return request.post(`/products`, params) }
export const updateProduct = params => { return request.patch(`/products`, params)}
// // export const getProductDetail = id => { return request.get(`${host}${prefix}/products?id=${id}`) };
export const getProductDetail = id => { return request.get(`/products/${id}`) };
export const deleteProduct = id => { return request.delete(`/products/${id}`) }

export const getBanners = () => { return request.get(`/banner`) };
export const addBanner = params => { return request.post(`/banner`, params)}
export const updateBanner = params => { return request.patch(`/banner`, params)}
export const deleteBanner = id => { return request.delete(`/banner/${id}`) }
// export const getNews = params => { return request.get(`${host}${prefix}/news`, params)};
// // export const getNewsDetail = id => { return request.get(`${host}${prefix}/news?id=${id}`)};
// export const getNewsDetail = id => { return request.get(`${host}${prefix}/news/${id}`)};
// export const getContacts = () => { return request.get(`${host}${prefix}/contacts`)};
// export const getPartner = () => { return request.get(`${host}${prefix}/partner`)};
