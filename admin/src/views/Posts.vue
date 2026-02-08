<template>
  <div class="posts-page">
    <div class="page-header">
      <h2>帖子管理</h2>
      <el-select v-model="statusFilter" placeholder="状态筛选" style="width: 150px" @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已发布" value="published" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
    </div>
    <el-card>
      <el-table :data="posts" style="width: 100%">
        <el-table-column prop="content" label="内容" show-overflow-tooltip min-width="200" />
        <el-table-column prop="author.nickname" label="作者" width="120" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isFeatured" label="精选" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.isFeatured" @change="toggleFeatured(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞" width="80" />
        <el-table-column prop="createTime" label="发布时间" width="160">
          <template #default="{ row }">
            {{ new Date(row.createTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" size="small" @click="approvePost(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" size="small" @click="rejectPost(row)">拒绝</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="page" :page-size="20" :total="total" layout="prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const posts = ref([])
const page = ref(1)
const total = ref(0)
const statusFilter = ref('')

const fetchPosts = async () => {
  try {
    const res = await request.get('/posts', { params: { page: page.value, status: statusFilter.value } })
    posts.value = res.posts
    total.value = res.total
  } catch (err) { console.error(err) }
}

const handleFilter = () => { page.value = 1; fetchPosts() }
const getStatusType = (status: string) => ({ pending: 'warning', published: 'success', rejected: 'danger' }[status] || 'info')
const getStatusText = (status: string) => ({ pending: '待审核', published: '已发布', rejected: '已拒绝' }[status] || status)

const toggleFeatured = async (post: any) => {
  try {
    await request.put(`/posts/${post._id}/status`, { isFeatured: post.isFeatured })
    ElMessage.success(post.isFeatured ? '已设为精选' : '取消精选')
  } catch (err) { console.error(err) }
}

const approvePost = async (post: any) => {
  try {
    await request.put(`/posts/${post._id}/status`, { status: 'published' })
    ElMessage.success('已通过审核')
    fetchPosts()
  } catch (err) { console.error(err) }
}

const rejectPost = async (post: any) => {
  try {
    await request.put(`/posts/${post._id}/status`, { status: 'rejected' })
    ElMessage.success('已拒绝')
    fetchPosts()
  } catch (err) { console.error(err) }
}

const handleDelete = async (id: string) => {
  await ElMessageBox.confirm('确定删除该帖子？', '警告', { type: 'warning' })
  try {
    await request.delete(`/posts/${id}`)
    ElMessage.success('删除成功')
    fetchPosts()
  } catch (err) { console.error(err) }
}

watch(page, fetchPosts)
onMounted(fetchPosts)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
