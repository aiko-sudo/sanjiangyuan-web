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
  background: var(--bg-overlay);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px var(--shadow-color);
  transition: all 0.3s ease;

  &.navbar-transparent {
    background: var(--bg-dark-overlay);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);

    .nav-item {
      color: #ffffff;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

      &:hover,
      &.active {
        color: var(--secondary-light);

        &::after {
          background: var(--secondary-light);
        }
      }
    }

    .logo-text {
      color: #ffffff;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    }

    .el-button {
      --el-button-bg-color: rgba(45, 106, 79, 0.95);
      --el-button-border-color: transparent;
      --el-button-hover-bg-color: var(--primary-light);
      --el-button-hover-border-color: transparent;
      color: #ffffff;
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
    text-shadow: 0 1px 2px rgba(45, 106, 79, 0.15);
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
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: var(--primary-color);
      border-radius: 2px;
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
  background: linear-gradient(180deg, var(--primary-dark) 0%, #0D1F17 100%);
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
    text-shadow: 0 1px 2px rgba(212, 168, 75, 0.3);
  }

  p,
  a {
    color: rgba(255, 255, 255, 0.75);
    line-height: 2;
    display: block;
    transition: all 0.3s ease;

    &:hover {
      color: #ffffff;
      transform: translateX(4px);
    }
  }
}

.footer-bottom {
  margin-top: 40px;
  padding: 24px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.2);

  p {
    color: rgba(255, 255, 255, 0.55);
    font-size: 13px;
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
    text-align: center;
  }

  .footer-section p,
  .footer-section a {
    &:hover {
      transform: none;
    }
  }
}
</style>
