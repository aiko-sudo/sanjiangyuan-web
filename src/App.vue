<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar" :class="{ 'navbar-transparent': isHome }">
      <div class="navbar-content">
          <router-link to="/" class="logo">
            <span class="logo-icon">🌿</span>
            <span class="logo-text">三江源生态保护</span>
          </router-link>
        
        <nav class="nav-links">
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
            首页
          </router-link>
          <router-link to="/community" class="nav-item" :class="{ active: $route.path === '/community' }">
            共创社区
          </router-link>
          <router-link to="/crafts" class="nav-item" :class="{ active: $route.path === '/crafts' }">
            非遗技艺
          </router-link>
          <router-link to="/eco" class="nav-item" :class="{ active: $route.path === '/eco' }">
            生态数据
          </router-link>
          <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
            个人中心
          </router-link>
        </nav>
        
        <div class="navbar-actions">
          <el-button type="primary" round size="large">
            立即参与
          </el-button>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>三江源生态保护平台致力于保护长江、黄河、澜沧江源头生态环境</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/community">共创社区</router-link>
          <router-link to="/crafts">非遗技艺</router-link>
          <router-link to="/eco">生态数据</router-link>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>邮箱: contact@sanjiangyuan.org</p>
          <p>电话: 0971-1234567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 三江源生态保护 | 用心守护，每一天</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &.navbar-transparent {
    background: transparent;
    box-shadow: none;
    
    .nav-item {
      color: #fff;
    }
    
    .logo-text {
      color: #fff;
    }
  }
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    font-size: 32px;
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
  }
}

.nav-links {
  display: flex;
  gap: 40px;
  
  .nav-item {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    padding: 8px 0;
    position: relative;
    transition: color 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary-color);
      transition: width 0.3s ease;
    }
    
    &:hover,
    &.active {
      color: var(--primary-color);
      
      &::after {
        width: 100%;
      }
    }
  }
}

.navbar-actions {
  display: flex;
  gap: 12px;
}

.main-content {
  flex: 1;
  padding-top: 70px;
}

.footer {
  background: #1a1a2e;
  color: #fff;
  padding: 60px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-section {
  h4 {
    font-size: 18px;
    margin-bottom: 20px;
    color: var(--accent-color);
  }
  
  p,
  a {
    color: rgba(255, 255, 255, 0.7);
    line-height: 2;
    display: block;
    
    &:hover {
      color: #fff;
    }
  }
}

.footer-bottom {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    color: rgba(255, 255, 255, 0.5);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
