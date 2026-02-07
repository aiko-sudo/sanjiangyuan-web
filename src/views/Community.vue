<template>
  <div class="community-page">
    <div class="page-header">
      <h1>共创社区</h1>
      <p>分享你的守护故事，遇见志同道合的守护者</p>
    </div>
    
    <div class="community-container">
      <!-- 左侧分类标签 -->
      <aside class="sidebar">
        <div class="category-tabs">
          <el-button 
            v-for="category in categories" 
            :key="category.id"
            :type="activeCategory === category.id ? 'primary' : 'default'"
            class="category-btn"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </el-button>
        </div>
        
        <!-- 热门话题榜 -->
        <div class="hot-topics card">
          <h3>🔥 热门话题</h3>
          <div class="topic-list">
            <div class="topic-item" v-for="topic in hotTopics" :key="topic.id">
              <span class="topic-rank">{{ topic.rank }}</span>
              <span class="topic-name">{{ topic.name }}</span>
              <span class="topic-count">{{ topic.count }}篇</span>
            </div>
          </div>
        </div>
        
        <!-- 创作达人榜 -->
        <div class="top-users card">
          <h3>🏆 创作达人榜</h3>
          <div class="user-list">
            <div class="user-item" v-for="(user, index) in topUsers" :key="user.id">
              <span class="user-rank">{{ index + 1 }}</span>
              <el-avatar :src="user.avatar" :size="36" />
              <div class="user-info">
                <span class="user-name">{{ user.nickname }}</span>
                <span class="user-contribution">{{ user.contribution }}贡献值</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 发帖按钮 -->
        <div class="create-post-area">
          <el-button type="primary" size="large" @click="showCreateDialog = true">
            <el-icon><Edit /></el-icon>
            发布守护故事
          </el-button>
          <span class="contribution-hint">发布可获得20贡献值</span>
        </div>
        
        <!-- 帖子列表 -->
        <div class="posts-list">
          <el-card 
            v-for="post in filteredPosts" 
            :key="post.id" 
            class="post-card"
            shadow="hover"
          >
            <div class="post-header">
              <el-avatar :src="post.author.avatar" :size="48" class="author-avatar" />
              <div class="author-info">
                <div class="author-top">
                  <span class="author-name">{{ post.author.nickname }}</span>
                  <el-tag size="small" :type="getLevelType(post.author.level)">
                    {{ post.author.level }}
                  </el-tag>
                </div>
                <span class="post-time">{{ formatTime(post.createTime) }}</span>
              </div>
            </div>
            
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div class="post-tags" v-if="post.tags.length">
                <el-tag 
                  v-for="tag in post.tags" 
                  :key="tag"
                  size="small"
                  type="info"
                  effect="plain"
                >
                  #{{ tag }}
                </el-tag>
              </div>
              <div class="post-images" v-if="post.images.length">
                <el-image 
                  v-for="(img, index) in post.images" 
                  :key="index"
                  :src="img" 
                  :preview-src-list="post.images"
                  fit="cover"
                  class="post-image"
                  :class="{ 'single-image': post.images.length === 1 }"
                />
              </div>
            </div>
            
            <div class="post-actions">
              <div class="action-left">
                <el-button 
                  :type="post.isLiked ? 'danger' : 'default'" 
                  @click="toggleLike(post)"
                >
                  <el-icon><Star /></el-icon>
                  {{ post.likes }}
                </el-button>
                <el-button @click="showCommentDialog(post)">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ post.comments }}
                </el-button>
                <el-button @click="sharePost(post)">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
              </div>
              <div class="action-right">
                <el-button type="warning" plain size="small">
                  <el-icon><Top /></el-icon>
                  推荐
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more">
          <el-button 
            v-if="hasMore" 
            type="primary" 
            plain 
            size="large" 
            :loading="loading"
            @click="loadMorePosts"
          >
            加载更多
          </el-button>
          <span v-else class="no-more">没有更多了</span>
        </div>
      </main>
    </div>
    
    <!-- 发帖对话框 -->
    <el-dialog v-model="showCreateDialog" title="发布守护故事" width="600px">
      <div class="create-form">
        <el-input
          v-model="newPost.content"
          type="textarea"
          :rows="6"
          placeholder="分享你的守护故事..."
          maxlength="2000"
          show-word-limit
        />
        
        <div class="upload-area">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="9"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
        
        <div class="tag-select">
          <span>添加标签：</span>
          <el-check-tag 
            v-for="tag in availableTags" 
            :key="tag"
            :checked="selectedTags.includes(tag)"
            @change="toggleTag(tag)"
          >
            {{ tag }}
          </el-check-tag>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPost" :loading="submitting">
          发布
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Edit, Star, ChatDotRound, Share, Plus, Top } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Post {
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
  createTime: Date
  tags: string[]
  isLiked: boolean
  category: string
}

const categories = [
  { id: 'all', name: '全部' },
  { id: 'story', name: '守护故事' },
  { id: 'craft', name: '非遗见闻' },
  { id: 'photo', name: '生态摄影' },
  { id: 'qa', name: '求助问答' },
  { id: 'official', name: '官方动态' }
]

const hotTopics = [
  { id: '1', rank: '1', name: '#我与雪豹的故事#', count: 1234 },
  { id: '2', rank: '2', name: '#非遗传承人#', count: 892 },
  { id: '3', rank: '3', name: '#巡护日记#', count: 567 },
  { id: '4', rank: '4', name: '#守护三江源#', count: 345 },
  { id: '5', rank: '5', name: '#环保知识#', count: 234 }
]

const topUsers = [
  { id: '1', nickname: '阿青', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=阿青', contribution: 12580 },
  { id: '2', nickname: '卓玛', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=卓玛', contribution: 8920 },
  { id: '3', nickname: '扎西', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=扎西', contribution: 6540 },
  { id: '4', nickname: '白玛', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=白玛', contribution: 4320 },
  { id: '5', nickname: '文扎', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=文扎', contribution: 3210 }
]

const availableTags = ['守护故事', '非遗', '摄影', '巡护', '野生动物', '环保']

const activeCategory = ref('all')
const showCreateDialog = ref(false)
const fileList = ref([])
const selectedTags = ref<string[]>([])
const loading = ref(false)
const submitting = ref(false)
const hasMore = ref(true)

const newPost = ref({
  content: ''
})

const posts = ref<Post[]>([
  {
    id: '1',
    author: { nickname: '阿青', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=阿青', level: '黄金守护者' },
    content: '今天在巡护途中遇到了三只藏原羚，它们警惕地看着我们，然后快速消失在草原深处。这就是三江源的魅力，总能遇到各种野生动物。',
    images: ['https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600'],
    likes: 128, comments: 32, createTime: new Date(), tags: ['守护故事', '野生动物'], isLiked: false, category: 'story'
  },
  {
    id: '2',
    author: { nickname: '卓玛', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=卓玛', level: '白银守护者' },
    content: '跟着唐卡传承人学了一个月，终于完成了第一幅作品！虽然还有很多不足，但这个过程让我深深感受到了非遗的魅力。',
    images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?w=600'],
    likes: 256, comments: 45, createTime: new Date(Date.now() - 3600000), tags: ['非遗'], isLiked: true, category: 'craft'
  },
  {
    id: '3',
    author: { nickname: '扎西', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=扎西', level: '钻石守护者' },
    content: '本周巡护里程达到150公里，发现野生动物足迹若干。三江源的生态正在一天天变好，这离不开每一位守护者的努力。',
    images: ['https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600', 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?w=600'],
    likes: 512, comments: 89, createTime: new Date(Date.now() - 7200000), tags: ['守护故事', '巡护'], isLiked: false, category: 'story'
  }
])

const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') return posts.value
  return posts.value.filter(p => p.category === activeCategory.value)
})

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

function toggleLike(post: Post) {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

function showCommentDialog(post: Post) {
  console.log('显示评论对话框', post.id)
}

function sharePost(_post: Post) {
  ElMessage.success('已复制分享链接')
}

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

async function submitPost() {
  if (!newPost.value.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  posts.value.unshift({
    id: String(posts.value.length + 1),
    author: { nickname: '当前用户', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=用户', level: '青铜守护者' },
    content: newPost.value.content,
    images: fileList.value.map((f: any) => f.url || ''),
    likes: 0, comments: 0, createTime: new Date(),
    tags: selectedTags.value, isLiked: false, category: 'story'
  })
  
  submitting.value = false
  showCreateDialog.value = false
  newPost.value.content = ''
  fileList.value = []
  selectedTags.value = []
  ElMessage.success('发布成功！获得20贡献值')
}

function loadMorePosts() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    hasMore.value = false
  }, 1000)
}
</script>

<style scoped lang="scss">
.community-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #fff;
  padding: 60px 20px;
  text-align: center;
  
  h1 {
    font-size: 36px;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
  }
}

.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.sidebar {
  .category-tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
    
    .category-btn {
      justify-content: flex-start;
      padding: 12px 16px;
    }
  }
  
  .card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      font-size: 16px;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
  }
}

.hot-topics {
  .topic-list {
    .topic-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .topic-rank {
        width: 24px;
        height: 24px;
        background: var(--accent-color);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
      }
      
      .topic-name {
        flex: 1;
        font-size: 14px;
        color: var(--text-primary);
      }
      
      .topic-count {
        font-size: 12px;
        color: var(--text-muted);
      }
    }
  }
}

.top-users {
  .user-list {
    .user-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      
      .user-rank {
        width: 24px;
        font-weight: 600;
        color: var(--accent-color);
        margin-right: 12px;
      }
      
      .user-info {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        
        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .user-contribution {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }
  }
}

.main-content {
  .create-post-area {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    .contribution-hint {
      color: var(--accent-color);
      font-size: 14px;
    }
  }
  
  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .post-card {
    border-radius: 16px;
    
    :deep(.el-card__body) {
      padding: 24px;
    }
  }
  
  .post-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    
    .author-avatar {
      border: 2px solid var(--accent-color);
    }
    
    .author-info {
      .author-top {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        
        .author-name {
          font-weight: 600;
          font-size: 16px;
          color: #1a3a5c;
        }
      }
      
      .post-time {
        font-size: 12px;
        color: var(--text-muted);
      }
    }
  }
  
  .post-content {
    margin-bottom: 16px;
    
    p {
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-primary);
      margin-bottom: 12px;
    }
    
    .post-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .post-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      
      .post-image {
        aspect-ratio: 1;
        border-radius: 8px;
        cursor: pointer;
        
        &.single-image {
          grid-column: span 1;
          max-width: 400px;
        }
      }
    }
  }
  
  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    
    .action-left {
      display: flex;
      gap: 8px;
    }
  }
  
  .load-more {
    text-align: center;
    padding: 40px 0;
    
    .no-more {
      color: var(--text-muted);
    }
  }
}

.create-form {
  .upload-area {
    margin: 20px 0;
  }
  
  .tag-select {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}

@media (max-width: 1024px) {
  .community-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}
</style>
