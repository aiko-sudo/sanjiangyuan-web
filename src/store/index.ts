import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  nickname: string
  avatar: string
  contribution: number
  level: string
  guardianDays: number
  guardianGrids: number
}

export interface Post {
  id: string
  author: {
    nickname: string
    avatar: string
    level: string
  }
  content: string
  images: string[]
  likes: number
  comments: number
  createTime: string
  tags: string[]
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  function setUser(userData: User) {
    user.value = userData
  }

  function logout() {
    user.value = null
  }

  function addContribution(points: number) {
    if (user.value) {
      user.value.contribution += points
    }
  }

  return { user, isLoggedIn, setUser, logout, addContribution }
})

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)

  async function fetchPosts() {
    loading.value = true
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    loading.value = false
  }

  return { posts, loading, fetchPosts }
})
