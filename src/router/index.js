import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'home', noCache: true }
    }]
  },
  {
    path: '/intro',
    component: Layout,
    children: [{
      path: 'index',
      name: 'introduction',
      component: () => import('@/views/introduction/index'),
      meta: { title: '公司简介', icon: 'introduce' }
    }]
  },
  {
    path: '/category',
    component: Layout,
    children: [{
      path: 'index',
      name: 'category',
      component: () => import('@/views/category/index'),
      meta: { title: '应用领域', icon: 'tree' }
    }]
  },
  {
    path: '/products',
    component: Layout,
    redirect: '/products/list',
    name: 'products',
    meta: { title: '产品信息', icon: 'products' },
    children: [
      { path: 'list', name: 'productsList', component: () => import('@/views/products/list'), meta: { title: '产品列表', icon: 'list' }},
      { path: 'create', name: 'createProduct', component: () => import('@/views/products/create'), meta: { title: '新增产品', icon: 'create' } },
      { path: 'edit/:id', name: 'editProduct', component: () => import('@/views/products/edit'), meta: { title: '编辑信息', icon: 'create' }, hidden: true }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    children: [{
      path: 'index',
      name: 'banner',
      component: () => import('@/views/banner/index'),
      meta: { title: '首页轮播图', icon: 'swiper' }
    }]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'news',
    meta: { title: '信息资讯', icon: 'news'},
    children: [
      { path: 'list', name: 'newsList', component: () => import('@/views/news/list'), meta: { title: '新闻列表', icon: 'list' }},
      { path: 'create', name: 'addNews', component: () => import('@/views/news/create'), meta: { title: '添加新闻', icon: 'create' } },
      { path: 'edit/:id', name: 'editNews', component: () => import('@/views/news/edit'), meta: { title: '编辑新闻', icon: 'create' }, hidden: true }
    ]
  },
  {
    path: '/partner',
    component: Layout,
    children: [{
      path: 'index',
      name: 'partner',
      component: () => import('@/views/partner/index'),
      meta: { title: '合作伙伴', icon: 'partner' }
    }]
  },
  {
    path: '/contacts',
    component: Layout,
    children: [{
      path: 'index',
      name: 'contacts',
      component: () => import('@/views/contacts/index'),
      meta: { title: '联系方式', icon: 'contact' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

