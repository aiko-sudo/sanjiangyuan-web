<template>
  <div class="dashboard">
    <h2>数据概览</h2>
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-icon users"><el-icon><User /></el-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.users }}</span>
          <span class="stat-label">用户总数</span>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon posts"><el-icon><Document /></el-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.posts }}</span>
          <span class="stat-label">已发布帖子</span>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon craftsmen"><el-icon><Star /></el-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.craftsmen }}</span>
          <span class="stat-label">传承人</span>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon pending"><el-icon><Warning /></el-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.pendingPosts }}</span>
          <span class="stat-label">待审核帖子</span>
        </div>
      </el-card>
    </div>
    
    <el-card class="recent-posts">
      <template #header>
        <div class="card-header">
          <span>最新帖子</span>
          <router-link to="/posts">查看全部</router-link>
        </div>
      </template>
      <el-table :data="recentPosts" style="width: 100%">
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="author.nickname" label="作者" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
              {{ row.status === 'published' ? '已发布' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="160">
          <template #default="{ row }">
            {{ new Date(row.createTime).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Document, Star, Warning } from '@element-plus/icons-vue'
import request from '@/api/request'

const stats = ref({ users: 0, posts: 0, craftsmen: 0, pendingPosts: 0 })
const recentPosts = ref([])

onMounted(async () => {
  try {
    const [overview, recent] = await Promise.all([
      request.get('/stats/overview'),
      request.get('/stats/recent')
    ])
    stats.value = overview
    recentPosts.value = recent.recentPosts
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  h2 { margin-bottom: 24px; font-size: 24px; }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }
  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #fff;
      &.users { background: linear-gradient(135deg, #409EFF, #66b1ff); }
      &.posts { background: linear-gradient(135deg, #67C23A, #85ce61); }
      &.craftsmen { background: linear-gradient(135deg, #E6A23C, #f5c06d); }
      &.pending { background: linear-gradient(135deg, #F56C6C, #f89898); }
    }
    .stat-value { display: block; font-size: 28px; font-weight: bold; color: #333; }
    .stat-label { font-size: 14px; color: #999; }
  }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
}
</style>
