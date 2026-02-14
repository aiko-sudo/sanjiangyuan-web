<template>
  <div class="index-page">
    <!-- Hero 视频背景区 -->
    <section class="hero-section">
      <div class="video-background">
        <video 
          ref="heroVideo"
          autoplay 
          muted 
          loop 
          playsinline 
          class="hero-video"
          @loadeddata="onVideoLoaded"
        >
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

const heroVideo = ref<HTMLVideoElement | null>(null)

function onVideoLoaded() {
  if (heroVideo.value) {
    heroVideo.value.classList.add('loaded')
  }
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

function getLevelType(level: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '青铜守护者': 'info',
    '白银守护者': 'primary',
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
  background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%);
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%);

  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .hero-video.loaded {
    opacity: 1;
  }

  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(27, 67, 50, 0.6) 0%,
      rgba(13, 31, 23, 0.8) 50%,
      rgba(26, 26, 46, 0.9) 100%
    );
  }
}

.hero-content {
  position: relative;
  text-align: center;
  color: #fff;
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-title {
  margin-bottom: 50px;

  .title-line {
    display: block;
    font-size: 56px;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(45, 106, 79, 0.4);
    margin-bottom: 16px;
    color: #ffffff;
    letter-spacing: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #d4efdf 50%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle-line {
    display: block;
    font-size: 24px;
    font-weight: 400;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 10px;
    padding-left: 10px;
  }
}

.data-dashboard {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 50px;
  flex-wrap: wrap;

  .data-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    padding: 24px 36px;
    min-width: 180px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }

    .data-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      background: linear-gradient(135deg, #ffffff 0%, #b8e6c8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .data-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      letter-spacing: 1px;
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;

  .action-btn {
    padding: 16px 32px;
    font-size: 15px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    color: #ffffff;
    backdrop-filter: blur(8px);

    &:hover,
    &:active {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.6);
    }

    &.share-btn {
      background: var(--primary-color);
      border-color: var(--primary-color);
      box-shadow: 0 4px 16px rgba(45, 106, 79, 0.5);

      &:hover {
        background: var(--primary-light);
        border-color: var(--primary-light);
        box-shadow: 0 8px 32px rgba(45, 106, 79, 0.6);
      }
    }

    .el-icon {
      font-size: 18px;
    }
  }
}

.featured-section {
  padding: 100px 0;
  background: linear-gradient(180deg, #E8F0EC 0%, #D0E0D9 50%, #C1D4C9 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 40px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
  margin-top: 80px;
}

.post-card {
  border-radius: 20px;
  overflow: hidden;
  background: var(--bg-white);
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--border-light);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px var(--shadow-color);
    border-color: var(--primary-light);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.post-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;

  .author-avatar {
    border: 3px solid var(--accent-color);
    box-shadow: 0 2px 8px rgba(212, 168, 75, 0.25);
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .author-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 15px;
    }
  }
}

.post-content {
  margin-bottom: 18px;

  p {
    color: var(--text-secondary);
    line-height: 1.9;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 14px;
  }

  .post-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .post-image {
      aspect-ratio: 1;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        z-index: 1;
      }
    }
  }
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);

  .post-stats {
    display: flex;
    gap: 20px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 14px;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .post-time {
    color: var(--text-muted);
    font-size: 12px;
  }
}

.load-more {
  text-align: center;
  margin-top: 20px;

  .el-button {
    padding: 16px 48px;
    font-size: 15px;
    border-radius: 50px;
    letter-spacing: 2px;
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-color);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(45, 106, 79, 0.3);
    }
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .data-dashboard {
    flex-wrap: wrap;
    gap: 20px;

    .data-card {
      min-width: 160px;
      padding: 20px 32px;

      .data-value {
        font-size: 32px;
      }
    }
  }
}

@media (max-width: 768px) {
  .hero-title {
    .title-line {
      font-size: 42px;
      letter-spacing: 2px;
    }

    .subtitle-line {
      font-size: 18px;
      letter-spacing: 4px;
    }
  }

  .data-dashboard {
    flex-direction: column;
    align-items: center;

    .data-card {
      width: 100%;
      max-width: 280px;
      padding: 20px 28px;

      .data-value {
        font-size: 28px;
      }

      .data-label {
        font-size: 13px;
      }
    }
  }

  .quick-actions {
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .action-btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
      padding: 14px 28px;
    }
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .featured-section {
    padding: 60px 0;
  }
}
</style>
