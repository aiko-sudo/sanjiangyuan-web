<template>
  <div class="community-page">
  <div class="page-header-common" style="background-image: url('https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1600');">
    <div class="header-content">
      <h1>共创社区</h1>
      <p>分享你的守护故事，遇见志同道合的守护者</p>
    </div>
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
    <el-dialog v-model="showCreateDialog" width="620px" :show-close="true" class="create-dialog">
      <template #header>
        <div class="dialog-header">
          <div class="dialog-header-icon">
            <el-icon :size="22"><Edit /></el-icon>
          </div>
          <div>
            <h3 class="dialog-title">发布守护故事</h3>
            <p class="dialog-subtitle">与万千守护者分享你的故事</p>
          </div>
        </div>
      </template>
      <div class="create-form">
        <div class="form-section">
          <el-input
            v-model="newPost.content"
            type="textarea"
            :rows="6"
            placeholder="写下你想分享的守护故事、非遗见闻、巡护日记……"
            maxlength="2000"
            show-word-limit
            class="story-textarea"
          />
        </div>

        <div class="form-section">
          <div class="section-label">📸 添加图片</div>
          <el-upload
            v-model:file-list="fileList"
            action="/api/upload"
            name="file"
            list-type="picture-card"
            :limit="9"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            class="story-upload"
          >
            <div class="upload-trigger">
              <el-icon :size="24"><Plus /></el-icon>
              <span>上传</span>
            </div>
          </el-upload>
        </div>

        <div class="form-section">
          <div class="section-label">🏷️ 添加标签</div>
          <div class="tag-pills">
            <span
              v-for="tag in availableTags"
              :key="tag"
              class="tag-pill"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateDialog = false" round>取消</el-button>
          <el-button type="primary" @click="submitPost" :loading="submitting" round class="submit-btn">
            <el-icon v-if="!submitting"><Edit /></el-icon>
            发布故事
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Edit, Star, ChatDotRound, Share, Plus, Top } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '../api/request'

interface Post {
  _id: string
  id?: string
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
  isLiked?: boolean
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
const currentPage = ref(1)
const totalPages = ref(1)

const newPost = ref({
  content: ''
})

const posts = ref<Post[]>([])

// 从数据库加载帖子
async function fetchPosts(page = 1) {
  loading.value = true
  try {
    const category = activeCategory.value
    const res: any = await request.get('/community', { params: { page, limit: 20, category } })
    if (page === 1) {
      posts.value = (res.posts || []).map((p: any) => ({ ...p, isLiked: false }))
    } else {
      posts.value.push(...(res.posts || []).map((p: any) => ({ ...p, isLiked: false })))
    }
    currentPage.value = res.page
    totalPages.value = res.totalPages
    hasMore.value = res.page < res.totalPages
  } catch (err) {
    console.error('加载帖子失败:', err)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取帖子
onMounted(() => {
  fetchPosts()
})

// 切换分类时重新加载
watch(activeCategory, () => {
  currentPage.value = 1
  fetchPosts(1)
})

const filteredPosts = computed(() => posts.value)

function getLevelType(level: string): 'info' | 'success' | 'warning' | 'danger' | undefined {
  const types: Record<string, 'info' | 'success' | 'warning' | 'danger' | undefined> = {
    '青铜守护者': 'info',
    '白银守护者': undefined,
    '黄金守护者': 'warning',
    '钻石守护者': 'danger'
  }
  return types[level] || 'info'
}

function formatTime(time: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(time).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

async function toggleLike(post: Post) {
  if (post.isLiked) return
  try {
    const res: any = await request.put(`/community/${post._id}/like`)
    post.likes = res.likes
    post.isLiked = true
  } catch (err) {
    console.error('点赞失败:', err)
  }
}

function showCommentDialog(_post: Post) {
  ElMessage.info('评论功能即将上线')
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

function handleUploadSuccess(res: any, file: any) {
  if (res.url) {
    file.url = res.url
  }
}

function handleUploadError() {
  ElMessage.error('图片上传失败，请重试')
}

async function submitPost() {
  if (!newPost.value.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }

  submitting.value = true
  try {
    const uploadedImages = fileList.value
      .map((f: any) => f.response?.url || f.url)
      .filter(Boolean)

    const res: any = await request.post('/community', {
      content: newPost.value.content,
      tags: selectedTags.value,
      category: 'story',
      images: uploadedImages,
      author: {
        nickname: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=用户',
        level: '青铜守护者'
      }
    })

    // 将新帖子插入到列表顶部
    posts.value.unshift({ ...res.post, isLiked: false })

    submitting.value = false
    showCreateDialog.value = false
    newPost.value.content = ''
    fileList.value = []
    selectedTags.value = []
    ElMessage.success('发布成功！获得20贡献值')
  } catch (err: any) {
    submitting.value = false
    ElMessage.error(err.response?.data?.message || '发布失败')
  }
}

function loadMorePosts() {
  if (hasMore.value) {
    fetchPosts(currentPage.value + 1)
  }
}
</script>

<style scoped lang="scss">
.community-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-header {
  background: var(--gradient-primary);
  color: #fff;
  padding: 64px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.03)"/></svg>');
    background-size: 200px;
    opacity: 0.5;
  }

  h1 {
    font-size: 40px;
    margin-bottom: 12px;
    position: relative;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  p {
    font-size: 16px;
    opacity: 0.95;
    position: relative;
    letter-spacing: 2px;
  }
}

.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}

.sidebar {
  .category-tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;

    .category-btn {
      justify-content: flex-start;
      padding: 14px 20px;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
  }

  .card {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px var(--shadow-color);
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--shadow-color);
    }

    h3 {
      font-size: 16px;
      margin-bottom: 20px;
      color: var(--text-primary);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.hot-topics {
  .topic-list {
    .topic-item {
      display: flex;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
      transition: all 0.3s ease;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        transform: translateX(4px);

        .topic-name {
          color: var(--primary-color);
        }
      }

      .topic-rank {
        width: 28px;
        height: 28px;
        background: var(--gradient-accent);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        margin-right: 14px;
        box-shadow: 0 2px 8px rgba(212, 168, 75, 0.3);
      }

      .topic-name {
        flex: 1;
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .topic-count {
        font-size: 12px;
        color: var(--text-muted);
        background: var(--bg-secondary);
        padding: 4px 10px;
        border-radius: 20px;
      }
    }
  }
}

.top-users {
  .user-list {
    .user-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateX(4px);

        .user-name {
          color: var(--primary-color);
        }
      }

      .user-rank {
        width: 28px;
        font-weight: 700;
        color: var(--accent-color);
        margin-right: 12px;
        font-size: 16px;
        text-shadow: 0 1px 4px rgba(212, 168, 75, 0.3);
      }

      .user-info {
        margin-left: 12px;
        display: flex;
        flex-direction: column;

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          transition: color 0.3s ease;
        }

        .user-contribution {
          font-size: 12px;
          color: var(--accent-color);
          font-weight: 500;
        }
      }
    }
  }
}

.main-content {
  .create-post-area {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 16px var(--shadow-color);
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px var(--shadow-color);
    }

    .contribution-hint {
      color: var(--accent-color);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;

      &::before {
        content: '✨';
      }
    }
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .post-card {
    border-radius: 20px;
    transition: all 0.4s ease;
    border: 1px solid var(--border-light);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px var(--shadow-color);
      border-color: var(--primary-light);
    }

    :deep(.el-card__body) {
      padding: 28px;
    }
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 20px;

    .author-avatar {
      border: 3px solid var(--accent-color);
      box-shadow: 0 4px 12px rgba(212, 168, 75, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .author-info {
      .author-top {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;

        .author-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--text-primary);
        }
      }

      .post-time {
        font-size: 13px;
        color: var(--text-muted);
      }
    }
  }

  .post-content {
    margin-bottom: 20px;

    p {
      font-size: 15px;
      line-height: 1.9;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .post-tags {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;

      .el-tag {
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
        border: 1px solid var(--primary-light);
        color: var(--primary-color);
        background: rgba(45, 106, 79, 0.08);
        transition: all 0.3s ease;

        &:hover {
          background: var(--primary-color);
          color: #ffffff;
        }
      }
    }

    .post-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      .post-image {
        aspect-ratio: 1;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.4s ease;
        object-fit: cover;

        &:hover {
          transform: scale(1.05);
          z-index: 1;
          box-shadow: 0 8px 24px var(--shadow-dark);
        }

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
    padding-top: 20px;
    border-top: 1px solid var(--border-light);

    .action-left {
      display: flex;
      gap: 12px;

      .el-button {
        border-radius: 24px;
        padding: 10px 20px;
        font-size: 14px;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);

        &:hover {
          background: rgba(45, 106, 79, 0.08);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .el-icon {
          margin-right: 6px;
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 48px 0;

    .no-more {
      color: var(--text-muted);
      font-size: 14px;
      letter-spacing: 2px;
    }
  }
}

/* 发帖弹窗 - 深度定制 */
:deep(.create-dialog) {
  .el-dialog {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
  }
  .el-dialog__header {
    padding: 24px 28px 16px;
    margin: 0;
    border-bottom: 1px solid #f0f2f5;
    background: linear-gradient(135deg, #f8faf9 0%, #eef7f1 100%);
  }
  .el-dialog__body {
    padding: 24px 28px;
    background-color: #ffffff;
  }
  .el-dialog__footer {
    padding: 16px 28px 24px;
    border-top: 1px solid #f0f2f5;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dialog-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.dialog-subtitle {
  font-size: 13px;
  color: var(--text-muted, #95a5a6);
  margin: 2px 0 0;
}

.create-form {
  .form-section {
    margin-bottom: 20px;
  }

  .section-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary, #5d6d7e);
    margin-bottom: 10px;
  }

  :deep(.story-textarea) {
    .el-textarea__inner {
      border-radius: 14px;
      padding: 16px 18px;
      font-size: 15px;
      line-height: 1.7;
      border: 1.5px solid #e8ecef;
      background: #fafbfc;
      transition: all 0.25s ease;
      resize: vertical;

      &:focus {
        border-color: var(--primary-color);
        background: #fff;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
      }

      &::placeholder {
        color: #b0bec5;
      }
    }
  }

  :deep(.story-upload) {
    .el-upload--picture-card {
      width: 90px;
      height: 90px;
      border-radius: 12px;
      border: 2px dashed #d8dee4;
      background: #fafbfc;
      transition: all 0.25s ease;

      &:hover {
        border-color: var(--primary-color);
        background: rgba(39, 174, 96, 0.04);
      }
    }

    .el-upload-list__item {
      width: 90px;
      height: 90px;
      border-radius: 12px;
    }
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #b0bec5;
    font-size: 12px;
  }

  .tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-pill {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    border: 1.5px solid #e0e6ec;
    color: var(--text-secondary, #5d6d7e);
    background: #fff;
    transition: all 0.25s ease;
    user-select: none;

    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: rgba(39, 174, 96, 0.05);
    }

    &.active {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: #fff;
      box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  .submit-btn {
    background: linear-gradient(135deg, var(--primary-color), #2ecc71);
    border: none;
    padding: 10px 28px;
    font-weight: 500;
    letter-spacing: 1px;
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
      transform: translateY(-1px);
    }
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

