<template>
  <div class="users-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-input v-model="keyword" placeholder="搜索用户" style="width: 300px" @input="handleSearch">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>
    <el-card>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="contribution" label="贡献值" width="100" />
        <el-table-column prop="level" label="等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          :page-size="20"
          :total="total"
          layout="prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const users = ref([])
const page = ref(1)
const total = ref(0)
const keyword = ref('')

const fetchUsers = async () => {
  try {
    const res = await request.get('/users', { params: { page: page.value, keyword: keyword.value } })
    users.value = res.users
    total.value = res.total
  } catch (err) { console.error(err) }
}

const handleSearch = () => { page.value = 1; fetchUsers() }
const handleDelete = async (id: string) => {
  await ElMessageBox.confirm('确定删除该用户？', '警告', { type: 'warning' })
  try {
    await request.delete(`/users/${id}`)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (err) { console.error(err) }
}

const getLevelType = (level: string) => {
  const types: Record<string, string> = { '青铜守护者': 'info', '白银守护者': '', '黄金守护者': 'warning', '钻石守护者': 'danger' }
  return types[level] || 'info'
}

watch(page, fetchUsers)
onMounted(fetchUsers)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
