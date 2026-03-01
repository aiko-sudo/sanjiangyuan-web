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
        <!-- 加深遮罩，确保文字清晰 -->
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
            class="action-btn-secondary"
            color="#bfa15f"
            @click="$router.push('/eco')"
          >
            <el-icon><Location /></el-icon>
            认领守护网格
          </el-button>
          <el-button 
            type="success" 
            size="large" 
            class="action-btn-secondary"
             color="#2d8f6f"
            @click="$router.push('/eco')"
          >
            <el-icon><VideoCamera /></el-icon>
            云探访保护站
          </el-button>
        </div>

        <!-- 首页中部广告位 -->
        <div class="home-ad-container" v-if="adConfig.homeMiddleAd.enabled">
          <AdBanner 
            :image="adConfig.homeMiddleAd.image"
            :link="adConfig.homeMiddleAd.link"
            :title="adConfig.homeMiddleAd.title"
          />
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
            :body-style="{ padding: '0px' }"
          >
            <div class="post-content-wrapper">
              <div class="post-header">
                <el-avatar :src="post.author.avatar" :size="48" class="author-avatar" />
                <div class="author-info">
                  <span class="author-name">{{ post.author.nickname }}</span>
                  <el-tag size="small" effect="plain" round :type="getLevelType(post.author.level)">
                    {{ post.author.level }}
                  </el-tag>
                </div>
              </div>
              
              <div class="post-text-content">
                <p>{{ post.content }}</p>
              </div>

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
            </div>
          </el-card>
        </div>
        
        <div class="load-more">
          <el-button class="load-more-btn" round size="large" @click="loadMorePosts">
            加载更多故事
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Edit, Location, VideoCamera, Star, ChatDotRound } from '@element-plus/icons-vue'
import AdBanner from '../components/AdBanner.vue'
import { adConfig } from '../config/ads'

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
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80'
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
      'https://images.unsplash.com/photo-1599576838383-a20cda72e259?w=800&q=80'
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
    images: [],
    likes: 512,
    comments: 89,
    createTime: new Date(Date.now() - 7200000)
  }
])

// 辅助函数：获取等级对应的 Tag 类型
const getLevelType = (level: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  switch (level) {
    case 'Lv.1': return 'info'
    case 'Lv.2': return 'success'
    case 'Lv.3': return 'warning'
    case 'Lv.4': return 'danger'
    case 'Lv.5': return 'primary'
    default: return 'info'
  }
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
  min-height: 700px;
  display: flex;
  align-items: center; 
  justify-content: center;
  overflow: hidden;
  background-color: #f0fdf4; /* Fallback 浅绿 */
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;

  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1s ease;
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
    /* 极致通透：仅在底部加一点点渐变以衬托白色文字，整体保持明亮 */
    background: linear-gradient(
      180deg,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0.05) 60%,
      rgba(0,0,0,0.3) 100%
    );
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  width: 100%;
  max-width: 1400px; /* 增加宽度至 1400px */
  padding: 0 20px;
  margin-top: -40px;
}

.hero-title {
  margin-bottom: 60px;
  
  .title-line {
    display: block;
    font-size: 5rem;
    font-weight: 800;
    color: #ffffff;
    /* 柔和的光晕阴影，而非硬黑阴影 */
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); 
    margin-bottom: 20px;
    letter-spacing: 4px; 
  }

  .subtitle-line {
    display: block;
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 8px;
    font-weight: 500;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
}

.data-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 60px;
  
  .data-card {
    /* 切换为亮色玻璃拟态：白底、高模糊 */
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); /* 极轻的阴影 */
    
    padding: 24px 16px;
    text-align: center;
    border-radius: 16px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }

    .data-value {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      /* 改为深绿色，在白底上清晰可见 */
      color: var(--primary-color); 
      margin-bottom: 8px;
      text-shadow: none; /* 去掉阴影，保持干净 */
    }

    .data-label {
      font-size: 0.9rem;
      color: var(--text-secondary); /* 深灰文字 */
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: none;
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px; /* 增加底部间距给广告位 */
  
  .action-btn {
    padding: 24px 48px;
    font-size: 1.1rem;
    border-radius: 50px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    
    .el-icon {
      margin-right: 8px;
    }
  }
  
  .action-btn-secondary {
    padding: 24px 32px;
    font-size: 1.1rem;
    border-radius: 50px;
    font-weight: 600;
    color: white;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border: none;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}

/* 广告位样式 */
.home-ad-container {
  max-width: 1000px;
  margin: 0 auto;
}

.featured-section {
  padding: 100px 0;
  background: var(--bg-body);
  
  .container {
    max-width: 1400px; /* 增加宽度至 1400px */
    margin: 0 auto;
    padding: 0 20px;
  }
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 60px;
  font-weight: 700;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

.post-card {
  border: none;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
}

.post-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.post-header {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .author-avatar {
    border: 2px solid var(--border-color);
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .author-name {
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1rem;
    }
  }
}

.post-text-content {
  padding: 0 20px;
  margin-bottom: 16px;
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 1rem;
  }
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 16px;
  padding: 0 20px;

  .post-image {
    aspect-ratio: 1;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f0f0f0;

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.post-footer {
  margin-top: auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  background: #fcfcfc;

  .post-stats {
    display: flex;
    gap: 20px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 0.9rem;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .post-time {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
}

.load-more {
  text-align: center;
  margin-top: 60px;

  .load-more-btn {
    padding: 12px 48px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    background: transparent;
    transition: all 0.3s;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .hero-title .title-line {
    font-size: 3.5rem;
  }
  
  .data-dashboard {
    grid-template-columns: repeat(2, 1fr);
    
    .data-card .data-value {
      font-size: 2rem;
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 100vh;
  }

  .hero-title {
    margin-bottom: 40px;
    
    .title-line {
      font-size: 2.5rem;
      letter-spacing: 4px;
    }
    .subtitle-line {
      font-size: 1.2rem;
      letter-spacing: 6px;
    }
  }

  .data-dashboard {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 20px;
  }

  .quick-actions {
    flex-direction: column;
    padding: 0 40px;
    gap: 16px;
    
    .action-btn, 
    .action-btn-secondary {
      width: 100%;
    }
  }
  
  .home-ad-container {
      padding: 0 20px;
  }
}
</style>
