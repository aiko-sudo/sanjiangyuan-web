<template>
  <div class="settings-page">
    <h2>系统设置</h2>
    <el-card class="settings-card">
      <h3>初始化管理员账号</h3>
      <p>如果是第一次运行，请初始化管理员账号</p>
      <el-button type="primary" @click="initAdmin" :loading="loading">初始化管理员</el-button>
      <p class="hint">初始化后账号: admin / admin123</p>
    </el-card>
    
    <el-card class="settings-card">
      <h3>修改密码</h3>
      <el-form :model="passwordForm" label-width="100px" style="max-width: 400px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword" :loading="pwLoading">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const pwLoading = ref(false)
const passwordForm = reactive({ oldPassword: '', newPassword: '' })

const initAdmin = async () => {
  loading.value = true
  try {
    const res = await request.post('/auth/init')
    ElMessage.success(res.message)
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '初始化失败')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  pwLoading.value = true
  try {
    await request.put('/auth/password', passwordForm)
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '修改失败')
  } finally {
    pwLoading.value = false
  }
}
</script>

<style scoped>
.settings-card { margin-bottom: 20px; }
.settings-card h3 { margin-bottom: 12px; }
.settings-card p { color: #666; margin-bottom: 16px; }
.hint { font-size: 12px; color: #999; margin-top: 12px; }
</style>
