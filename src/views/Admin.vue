<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../api/request'

const activeTab = ref('users')
const users = ref([])
const auditUsers = ref([])
const posts = ref([])
const loading = ref(false)
const stats = ref({
  totalUsers: 0,
  totalPosts: 0,
  pendingPosts: 0,
  pendingUsers: 0
})

// 分页相关
const userQuery = ref({ page: 1, limit: 10, total: 0 })
const auditQuery = ref({ page: 1, limit: 10, total: 0 })
const postQuery = ref({ page: 1, limit: 10, total: 0 })

// 设置相关
const settingsLoading = ref(false)
const ecoStoryForm = ref({ value: '' })

const fetchSettings = async () => {
  try {
    const res: any = await request.get('/settings/eco_story')
    ecoStoryForm.value.value = res.value
  } catch (error) {
    console.error('Fetch settings failed')
  }
}

const saveEcoStory = async () => {
  settingsLoading.value = true
  try {
    await request.put('/settings/eco_story', { value: ecoStoryForm.value.value })
    ElMessage.success('发布成功')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '保存失败')
  } finally {
    settingsLoading.value = false
  }
}

const fetchStats = async () => {
  try {
    const res: any = await request.get('/posts/stats/overview')
    stats.value.totalPosts = res.total
    stats.value.pendingPosts = res.pending
    
    // 获取待审核用户数
    const userRes: any = await request.get('/users', { params: { status: 'pending', limit: 1 } })
    stats.value.pendingUsers = userRes.total
  } catch (error) {
    console.error('Fetch stats failed', error)
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/users', {
      params: { page: userQuery.value.page, limit: userQuery.value.limit, status: 'approved' }
    })
    users.value = res.users
    userQuery.value.total = res.total
    stats.value.totalUsers = res.total
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const fetchAuditUsers = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/users', {
      params: { page: auditQuery.value.page, limit: auditQuery.value.limit, status: 'pending' }
    })
    auditUsers.value = res.users
    auditQuery.value.total = res.total
  } catch (error) {
    ElMessage.error('加载待审核列表失败')
  } finally {
    loading.value = false
  }
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/posts', {
      params: { page: postQuery.value.page, limit: postQuery.value.limit }
    })
    posts.value = res.posts
    postQuery.value.total = res.total
  } catch (error) {
    ElMessage.error('加载帖子列表失败')
  } finally {
    loading.value = false
  }
}

const handleUserAudit = async (id: string, status: string) => {
  try {
    await request.put(`/users/${id}/status`, { status })
    ElMessage.success(status === 'approved' ? '审核通成功' : '已拒绝申请')
    fetchAuditUsers()
    fetchUsers()
    fetchStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteUser = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？此操作不可逆', '提示', { 
      type: 'warning',
      confirmButtonClass: 'custom-msg-btn',
      center: true 
    })
    await request.delete(`/users/${id}`)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

const updatePostStatus = async (id: string, status: string) => {
  try {
    await request.put(`/posts/${id}/status`, { status })
    ElMessage.success('操作成功')
    fetchPosts()
    fetchStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deletePost = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条内容吗？', '提示', { 
      type: 'warning',
      confirmButtonClass: 'custom-msg-btn',
      center: true
    })
    await request.delete(`/posts/${id}`)
    ElMessage.success('删除成功')
    fetchPosts()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchStats()
  fetchUsers()
  fetchAuditUsers()
  fetchPosts()
  fetchSettings()
})
</script>

<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="header-content">
        <h1>后台管理中心</h1>
        <div class="stats-row">
          <div class="stat-card">
            <span class="label">总用户</span>
            <span class="value">{{ stats.totalUsers }}</span>
          </div>
          <div class="stat-card warning">
            <span class="label">待审用户</span>
            <span class="value">{{ stats.pendingUsers }}</span>
          </div>
          <div class="stat-card">
            <span class="label">总帖子</span>
            <span class="value">{{ stats.totalPosts }}</span>
          </div>
          <div class="stat-card warning">
            <span class="label">待审帖子</span>
            <span class="value">{{ stats.pendingPosts }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="admin-body">
      <el-tabs v-model="activeTab" class="admin-tabs">
        <el-tab-pane label="用户审核" name="audit">
          <el-table :data="auditUsers" v-loading="loading" stripe style="width: 100%">
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="nickname" label="申请昵称" width="150" />
            <el-table-column prop="createdAt" label="申请时间">
              <template #default="{ row }">
                {{ new Date(row.createdAt).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="success" @click="handleUserAudit(row._id, 'approved')">通过</el-button>
                <el-button link type="danger" @click="handleUserAudit(row._id, 'rejected')">拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="auditQuery.page"
              :page-size="auditQuery.limit"
              layout="prev, pager, next"
              :total="auditQuery.total"
              @current-change="fetchAuditUsers"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="正式用户" name="users">
          <el-table :data="users" v-loading="loading" stripe style="width: 100%">
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="nickname" label="昵称" width="150" />
            <el-table-column prop="role" label="角色">
              <template #default="{ row }">
                <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">{{ row.role }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'approved' ? 'success' : 'info'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间">
              <template #default="{ row }">
                {{ new Date(row.createdAt).toLocaleDateString() }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button 
                  v-if="row.username !== 'admin'" 
                  link 
                  type="danger" 
                  @click="deleteUser(row._id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="userQuery.page"
              :page-size="userQuery.limit"
              layout="prev, pager, next"
              :total="userQuery.total"
              @current-change="fetchUsers"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="内容审核" name="posts">
          <el-table :data="posts" v-loading="loading" stripe style="width: 100%">
            <el-table-column label="内容预览" min-width="250">
              <template #default="{ row }">
                <div class="post-preview">
                  <div class="post-text">{{ row.content }}</div>
                  <div v-if="row.images?.length" class="post-images">
                    <el-image 
                      v-for="(img, idx) in row.images" 
                      :key="idx"
                      :src="img" 
                      class="mini-img"
                      :preview-src-list="[img]"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="发布者" width="120">
              <template #default="{ row }">
                {{ row.author?.nickname || '未知用户' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
                  {{ row.status === 'published' ? '已通过' : '待审核' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" fixed="right">
              <template #default="{ row }">
                <el-button 
                  v-if="row.status !== 'published'" 
                  link 
                  type="success" 
                  @click="updatePostStatus(row._id, 'published')"
                >通过并发布</el-button>
                <el-button 
                  link 
                  type="danger" 
                  @click="deletePost(row._id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="postQuery.page"
              :page-size="postQuery.limit"
              layout="prev, pager, next"
              :total="postQuery.total"
              @current-change="fetchPosts"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="系统设置" name="settings">
          <div class="settings-content">
            <div class="setting-card">
              <h3>📖 生态中心 - 生态故事</h3>
              <p class="hint">修改生态数据页面显示的介绍文章（支持换行）</p>
              <el-input
                v-model="ecoStoryForm.value"
                type="textarea"
                :rows="15"
                placeholder="请输入生态故事内容..."
              />
              <div class="setting-actions">
                <el-button type="primary" @click="saveEcoStory" :loading="settingsLoading">
                  保存并发布
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-container {
  min-height: calc(100vh - 70px);
  background: #f8fbf9;
}

.admin-header {
  background: var(--primary-color);
  color: white;
  padding: 40px 0;
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 30px;
    }
  }
}

.stats-row {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  min-width: 140px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &.warning {
    border-color: rgba(255, 152, 0, 0.5);
    .value { color: #ffe082; }
  }
  
  .label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 24px;
    font-weight: 700;
  }
}

.admin-body {
  max-width: 1200px;
  margin: -20px auto 40px;
  padding: 0 20px;
}

.admin-tabs {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.post-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  display: flex;
  gap: 5px;
  
  .mini-img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.settings-content {
  padding: 10px;
  
  .setting-card {
    max-width: 800px;
    
    h3 {
      font-size: 18px;
      margin-bottom: 8px;
      color: var(--primary-color);
    }
    
    .hint {
      font-size: 13px;
      color: #666;
      margin-bottom: 20px;
    }
    
    .setting-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
