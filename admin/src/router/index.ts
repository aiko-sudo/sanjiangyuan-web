import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
  { path: '/', component: () => import('@/views/Layout.vue'), meta: { requiresAuth: true }, children: [
    { path: '', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据概览' } },
    { path: 'users', name: 'Users', component: () => import('@/views/Users.vue'), meta: { title: '用户管理' } },
    { path: 'posts', name: 'Posts', component: () => import('@/views/Posts.vue'), meta: { title: '帖子管理' } },
    { path: 'craftsmen', name: 'Craftsmen', component: () => import('@/views/Craftsmen.vue'), meta: { title: '传承人管理' } },
    { path: 'settings', name: 'Settings', component: () => import('@/views/Settings.vue'), meta: { title: '系统设置' } }
  ]}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 后台管理` : '后台管理'
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token && to.path !== '/login') {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
