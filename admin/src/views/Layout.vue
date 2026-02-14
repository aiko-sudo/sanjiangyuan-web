<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <h3>后台管理</h3>
      </div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/">
          <el-icon><DataBoard /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon><Document /></el-icon>
          <span>帖子管理</span>
        </el-menu-item>
        <el-menu-item index="/craftsmen">
          <el-icon><Star /></el-icon>
          <span>传承人管理</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="breadcrumb">三江源生态保护 / {{ $route.meta.title }}</div>
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">管理员 <el-icon><ArrowDown /></el-icon></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DataBoard, User, Document, Star, Setting, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout-container { height: 100vh; }
.sidebar {
  background: #1a3a5c;
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    h3 { color: #fff; font-size: 18px; }
  }
  .el-menu { background: transparent; border: none; }
  .el-menu-item {
    color: rgba(255, 255, 255, 0.8);
    &:hover, &.is-active { background: rgba(255, 255, 255, 0.1); color: #fff; }
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.user-name { cursor: pointer; display: flex; align-items: center; gap: 4px; }
</style>
