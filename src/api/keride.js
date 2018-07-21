import request from '@/utils/request'

// export function getIntro() {
//   return request({
//     url: '/intro',
//     method: 'get'
//   })
// }

export const getIntro = () => { return request.get(`/intro`) }
export const updateIntro = params => { return request.patch(`/intro`, params) }

export const getCategory = (params) => { return request.get(`/categories`, {params: params}) }
export const createCategory = params => { return request.post(`/categories`, params) }
export const updateCategory = params => { return request.patch(`/categories`, params) }
export const deleteCategory = id => { return request.delete(`/categories/${id}`) }

export const getProducts = params => { return request.get(`/products`, {params: params}) }
export const createProduct = params => { return request.post(`/products`, params) }
export const updateProduct = params => { return request.patch(`/products`, params)}
export const getProductDetail = id => { return request.get(`/products/${id}`) };
export const deleteProduct = id => { return request.delete(`/products/${id}`) }

export const getBanners = () => { return request.get(`/banner`) };
export const addBanner = params => { return request.post(`/banner`, params)}
export const updateBanner = params => { return request.patch(`/banner`, params)}
export const deleteBanner = id => { return request.delete(`/banner/${id}`) }

export const getNews = params => { return request.get(`/news`, {params: params})};
export const getNewsDetail = id => { return request.get(`/news/${id}`) };
export const addNews = params => { return request.post(`/news`, params)}
export const updateNews = params => { return request.patch(`/news`, params)}
export const deleteNews = id => { return request.delete(`/news/${id}`) }

export const getPartner = params => { return request.get(`/partner`, {params: params})};
export const addPartner = params => { return request.post(`/partner`, params)};
export const updatePartner = params => { return request.patch(`/partner`, params)}
export const deletePartner = id => { return request.delete(`/partner/${id}`)};

export const getContacts = () => { return request.get(`/contacts`)};
export const addContacts = params => { return request.post(`/contacts`, params)};
export const updateContacts = params => { return request.patch(`/contacts`, params)}
export const deleteContacts = id => { return request.delete(`/contacts/${id}`)};

