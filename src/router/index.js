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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
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
      meta: { title: '产品分类', icon: 'introduce' }
    }]
  },
  {
    path: '/products',
    component: Layout,
    redirect: '/products/list',
    name: 'products',
    meta: { title: '产品信息', icon: 'introduce' },
    children: [
      { path: 'list', name: 'productsList', component: () => import('@/views/products/list'), meta: { title: '产品列表', icon: 'introduce' }},
      { path: 'create', name: 'createProduct', component: () => import('@/views/products/create'), meta: { title: '新增产品', icon: 'introduce' } },
      { path: 'edit/:id', name: 'editProduct', component: () => import('@/views/products/edit'), meta: { title: '编辑信息', icon: 'introduce' }, hidden: true }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    children: [{
      path: 'index',
      name: 'banner',
      component: () => import('@/views/banner/index'),
      meta: { title: '首页轮播图', icon: 'introduce' }
    }]
  },
  {
    path: '/news',
    component: Layout,
    children: [{
      path: 'index',
      name: 'news',
      component: () => import('@/views/news/index'),
      meta: { title: '新闻中心', icon: 'introduce' }
    }]
  },
  {
    path: '/partner',
    component: Layout,
    children: [{
      path: 'index',
      name: 'partner',
      component: () => import('@/views/partner/index'),
      meta: { title: '合作伙伴', icon: 'introduce' }
    }]
  },
  {
    path: '/contacts',
    component: Layout,
    children: [{
      path: 'index',
      name: 'contacts',
      component: () => import('@/views/contacts/index'),
      meta: { title: '联系方式', icon: 'introduce' }
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

