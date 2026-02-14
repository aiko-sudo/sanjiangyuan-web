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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '三江源生态保护'
  next()
})

export default router
