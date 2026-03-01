import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    meta: { title: '首页 - 三江源生态保护' }
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/Community.vue'),
    meta: { title: '共创社区' }
  },
  {
    path: '/crafts',
    name: 'Crafts',
    component: () => import('../views/Crafts.vue'),
    meta: { title: '非遗技艺' }
  },
  {
    path: '/eco',
    name: 'Eco',
    component: () => import('../views/Eco.vue'),
    meta: { title: '生态数据中心' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: '个人中心' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { title: '后台管理', requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '三江源生态保护'

  if (to.meta.requiresAdmin) {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    if (user && user.role === 'admin') {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
