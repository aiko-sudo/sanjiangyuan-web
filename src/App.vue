<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from './api/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const showJoinDialog = ref(false)
const showLoginDialog = ref(false)
const authTab = ref('login')
const loading = ref(false)
const isLoggedIn = ref(!!localStorage.getItem('token'))
const isAdmin = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  nickname: '',
  password: ''
})

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  isAdmin.value = user && user.role === 'admin'
}

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('auth-change', checkLoginStatus)
})

onUnmounted(() => {
  window.removeEventListener('auth-change', checkLoginStatus)
})

async function handleLogin() {
  if (!loginForm.value.username || !loginForm.value.password) {
    return ElMessage.warning('请填写用户名和密码')
  }
  
  loading.value = true
  try {
    const res: any = await request.post('/auth/login', loginForm.value)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    ElMessage.success('登录成功')
    showLoginDialog.value = false
    isLoggedIn.value = true
    window.dispatchEvent(new CustomEvent('auth-change'))
    router.push('/profile')
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名或密码')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!registerForm.value.username || !registerForm.value.nickname || !registerForm.value.password) {
    return ElMessage.warning('请填写完整注册信息')
  }
  
  loading.value = true
  try {
    await request.post('/auth/register', registerForm.value)
    ElMessage.success('注册申请已提交，请等待管理员审核')
    showLoginDialog.value = false // 注册完成后关闭对话框
    authTab.value = 'login'
  } catch (error) {
    ElMessage.error('注册失败，用户名可能已存在')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar">
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
          <router-link v-if="isLoggedIn" to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
            个人中心
          </router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-item" :class="{ active: $route.path === '/admin' }">
            后台管理
          </router-link>
          <a v-else-if="!isLoggedIn" href="javascript:;" class="nav-item" @click="showLoginDialog = true">
            登录/注册
          </a>
        </nav>
        
        <div class="navbar-actions">
          <el-button type="primary" round size="large" @click="showJoinDialog = true">
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

    <!-- 立即参与二维码对话框 -->
    <el-dialog v-model="showJoinDialog" width="420px" class="join-dialog" align-center>
      <div class="join-content">
        <h3 class="join-title">欢迎加入三江源守护者</h3>
        <p class="join-desc">
          扫码关注官方服务号 <br>
          随时获取最新志愿者招募信息，参与核心生态保护工作
        </p>
        <div class="qr-code-wrapper">
          <img src="https://api.dicebear.com/7.x/identicon/svg?seed=sanjiangyuan" alt="公众号二维码" class="qr-image" />
        </div>
        <p class="qr-tip">（微信扫一扫关注）</p>
      </div>
    </el-dialog>

    <!-- 登录/注册对话框 -->
    <el-dialog v-model="showLoginDialog" width="400px" title="欢迎回来" class="auth-dialog custom-dialog" align-center>
      <div class="auth-content">
        <el-tabs v-model="authTab">
          <el-tab-pane label="登录" name="login">
            <el-form :model="loginForm" label-position="top">
              <el-form-item label="用户名">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password @keyup.enter="handleLogin" />
              </el-form-item>
              <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">立即登录</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <el-form :model="registerForm" label-position="top">
              <el-form-item label="用户名">
                <el-input v-model="registerForm.username" placeholder="建议使用手机号" />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="registerForm.nickname" placeholder="想一个好听的名字" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
              </el-form-item>
              <el-button type="primary" class="submit-btn" :loading="loading" @click="handleRegister">通过审核后加入</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>三江源生态保护平台</p>
          <p>致力于保护长江、黄河、澜沧江源头生态环境</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/community">共创社区</router-link>
          <router-link to="/eco">生态数据</router-link>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>邮箱: contact@sanjiangyuan.org</p>
          <p>电话: 0971-8135112(省生态环境厅)</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026  三江源生态保护 | 用心守护，每一天</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
/* 解决弹窗透明度问题 */
:deep(.custom-dialog) {
  background: #ffffff !important;
  opacity: 1 !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
  
  .el-dialog__header {
    display: block !important;
    padding: 20px 20px 10px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.auth-content {
  padding: 0 10px 20px;
  
  .submit-btn {
    width: 100%;
    margin-top: 10px;
    height: 44px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
  }
}

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
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.4s ease;
  height: 70px;
  display: flex;
  align-items: center;

  &.navbar-transparent {
    background: transparent; /* 完全透明，只有渐变阴影 */
    backdrop-filter: none;
    box-shadow: none;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);
    
    .nav-item {
      color: rgba(255, 255, 255, 0.95);
      font-weight: 500;
      
      &:hover, 
      &.active {
        color: #ffffff;
        
        &::after {
          background: #ffffff;
          transform: scaleX(1);
        }
      }
    }

    .logo-text {
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    .el-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: #ffffff;
      
      &:hover {
        background: var(--primary-color);
        border-color: var(--primary-color);
      }
    }
  }
}

.navbar-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  .logo-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
  }
}

.nav-links {
  display: flex;
  gap: 40px;

  .nav-item {
    font-size: 16px;
    color: var(--text-primary);
    text-decoration: none;
    padding: 8px 0;
    position: relative;
    font-weight: 500;
    transition: color 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--primary-color);
      transform: scaleX(0); /* 默认隐藏 */
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    &:hover,
    &.active {
      color: var(--primary-color);

      &::after {
        transform: scaleX(1);
      }
    }
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .el-button {
    font-weight: 600;
    padding: 20px 24px;
    border-radius: 50px;
    transition: all 0.3s ease;
  }
}

/* 立即参与对话框样式 */
:deep(.join-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);

  .el-dialog__header {
    display: none;
  }
  
  .el-dialog__body {
    padding: 0;
  }
}

.join-content {
  padding: 40px 32px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f7fefa 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--primary-color), #2ecc71);
  }

  .join-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 12px;
  }

  .join-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 28px;
  }

  .qr-code-wrapper {
    width: 200px;
    height: 200px;
    margin: 0 auto 16px;
    padding: 12px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
    border: 1px solid rgba(39, 174, 96, 0.1);

    .qr-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }
  }

  .qr-tip {
    font-size: 13px;
    color: var(--primary-color);
    font-weight: 500;
    margin: 0;
  }
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
  max-width: 1400px;
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

/* 确保遮罩层不透明 */
.v-modal {
  opacity: 0.5 !important;
  background: #000 !important;
}

.custom-msg-btn {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  
  &:hover {
    background-color: var(--primary-dark) !important;
    border-color: var(--primary-dark) !important;
  }
}
</style>

<!-- 全局样式，用于覆盖不在 #app 内的组件 -->
<style lang="scss">
.el-message-box {
  background-color: #ffffff !important;
  opacity: 1 !important;
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
  z-index: 3000 !important;
  
  .el-message-box__header {
    display: block !important;
    padding: 24px 24px 12px !important;
    border-bottom: 1px solid #f0f0f0;
  }
}

.custom-confirm-box {
  background-color: #ffffff !important;
  opacity: 1 !important;
  border: none !important;
}

.el-overlay.is-message-box {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
