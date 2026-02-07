<template>
  <div class="index-page">
    <!-- Hero 视频背景区 -->
    <section class="hero-section">
      <div class="video-background">
        <video autoplay muted loop playsinline class="hero-video">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-mountain-ranges-at-sunset-1588-large.mp4" type="video/mp4" />
        </video>
        <div class="video-overlay"></div>
      </div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">守护三江源</span>
          <span class="subtitle-line">人人都是守护者</span>
        </h1>
        
        <!-- 核心数据看板 -->
        <div class="data-dashboard">
          <div class="data-card" v-for="item in dashboardData" :key="item.label">
            <div class="data-value">{{ item.value }}</div>
            <div class="data-label">{{ item.label }}</div>
          </div>
        </div>
        
        <!-- 快速行动区 -->
        <div class="quick-actions">
          <el-button 
            type="primary" 
            size="large" 
            class="action-btn share-btn"
            @click="$router.push('/community')"
          >
            <el-icon><Edit /></el-icon>
            分享你的守护故事
          </el-button>
          <el-button 
            type="warning" 
            size="large" 
            class="action-btn"
            @click="$router.push('/eco')"
          >
            <el-icon><Location /></el-icon>
            认领守护网格
          </el-button>
          <el-button 
            type="success" 
            size="large" 
            class="action-btn"
            @click="$router.push('/eco')"
          >
            <el-icon><VideoCamera /></el-icon>
            云探访保护站
          </el-button>
        </div>
      </div>
    </section>
    
    <!-- 精选动态流 -->
    <section class="featured-section">
      <div class="container">
        <h2 class="section-title">精选守护故事</h2>
        <div class="posts-grid">
          <el-card 
            v-for="post in featuredPosts" 
            :key="post.id" 
            class="post-card"
            shadow="hover"
          >
            <div class="post-header">
              <el-avatar :src="post.author.avatar" :size="40" class="author-avatar" />
              <div class="author-info">
                <span class="author-name">{{ post.author.nickname }}</span>
                <el-tag size="small" :type="getLevelType(post.author.level)">
                  {{ post.author.level }}
                </el-tag>
              </div>
            </div>
            
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div class="post-images" v-if="post.images.length">
                <el-image 
                  v-for="(img, index) in post.images.slice(0, 3)" 
                  :key="index"
                  :src="img" 
                  :preview-src-list="post.images"
                  fit="cover"
                  class="post-image"
                />
              </div>
            </div>
            
            <div class="post-footer">
              <div class="post-stats">
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ post.likes }}
                </span>
                <span class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ post.comments }}
                </span>
              </div>
              <span class="post-time">{{ formatTime(post.createTime) }}</span>
            </div>
          </el-card>
        </div>
        
        <div class="load-more">
          <el-button type="primary" plain size="large" @click="loadMorePosts">
            加载更多
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Edit, Location, VideoCamera, Star, ChatDotRound } from '@element-plus/icons-vue'

interface DashboardItem {
  value: string
  label: string
}

const dashboardData = ref<DashboardItem[]>([
  { value: '234', label: '今日新增守护故事' },
  { value: '12,580', label: '累计保护面积(km²)' },
  { value: '3,847', label: '在线守护者' },
  { value: '32', label: '本周雪豹影像(次)' }
])

const featuredPosts = ref([
  {
    id: '1',
    author: {
      nickname: '阿青',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=阿青',
      level: '黄金守护者'
    },
    content: '今天在可可西里不冻泉保护站巡护时，幸运地拍到了雪豹的踪迹！这是我们保护区本月第32次监测到雪豹了。',
    images: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=400',
      'https.com/photo-156://images.unsplash4349683136-77e08dba1ef7?w=400'
    ],
    likes: 128,
    comments: 32,
    createTime: new Date()
  },
  {
    id: '2',
    author: {
      nickname: '卓玛',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=卓玛',
      level: '白银守护者'
    },
    content: '跟着传承人学习唐卡绘制已经一个月了，今天终于完成了第一幅作品！感谢才让扎西大师的悉心指导。',
    images: [
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400'
    ],
    likes: 256,
    comments: 45,
    createTime: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    author: {
      nickname: '扎西',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=扎西',
      level: '钻石守护者'
    },
    content: '今天组织了20名志愿者在长江源区清理垃圾，保护野生动物栖息地。大家辛苦了！',
    images: [
      'https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?w=400'
    ],
    likes: 512,
    comments: 89,
    createTime: new Date(Date.now() - 7200000)
  }
])

function getLevelType(level: string): string {
  const types: Record<string, string> = {
    '青铜守护者': 'info',
    '白银守护者': '',
    '黄金守护者': 'warning',
    '钻石守护者': 'danger'
  }
  return types[level] || 'info'
}

function formatTime(time: Date): string {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

function loadMorePosts() {
  console.log('加载更多帖子')
}

// 模拟实时数据更新
let updateInterval: ReturnType<typeof setInterval>
onMounted(() => {
  updateInterval = setInterval(() => {
    // 模拟数据更新
    if (dashboardData.value[0]) {
      dashboardData.value[0].value = String(234 + Math.floor(Math.random() * 10))
    }
    if (dashboardData.value[2]) {
      dashboardData.value[2].value = String(3847 + Math.floor(Math.random() * 100))
    }
  }, 30000)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  
  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1e8a4a;
}
}

.hero-content {
  text-align: center;
  color: #fff;
  padding: 20px;
}

.hero-title {
  margin-bottom: 60px;
  
  .title-line {
    display: block;
    font-size: 64px;
    font-weight: 700;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    margin-bottom: 16px;
  }
  
  .subtitle-line {
    display: block;
    font-size: 28px;
    font-weight: 400;
    opacity: 0.9;
  }
}

.data-dashboard {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 60px;
  
  .data-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 24px 40px;
    min-width: 180px;
    
    .data-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    
    .data-label {
      font-size: 14px;
      opacity: 0.9;
      color: #fff;
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  
  .action-btn {
    padding: 16px 32px;
    font-size: 16px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover,
    &:active {
      transform: none;
      box-shadow: none;
    }
    
    &.share-btn {
      background: #409EFF;
      border-color: #409EFF;
    }
  }
}

.featured-section {
  padding: 80px 0;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.post-card {
  border-radius: 16px;
  overflow: hidden;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .author-avatar {
    border: 2px solid var(--accent-color);
  }
  
  .author-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .author-name {
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.post-content {
  margin-bottom: 16px;
  
  p {
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .post-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    
    .post-image {
      aspect-ratio: 1;
      border-radius: 8px;
      cursor: pointer;
    }
  }
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .post-stats {
    display: flex;
    gap: 16px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 14px;
    }
  }
  
  .post-time {
    color: var(--text-muted);
    font-size: 12px;
  }
}

.load-more {
  text-align: center;
}

/* 响应式 */
@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    .title-line {
      font-size: 40px;
    }
    
    .subtitle-line {
      font-size: 20px;
    }
  }
  
  .data-dashboard {
    flex-wrap: wrap;
    gap: 16px;
    
    .data-card {
      min-width: 140px;
      padding: 16px 24px;
      
      .data-value {
        font-size: 28px;
      }
    }
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
