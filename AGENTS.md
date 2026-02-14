# 三江源生态保护 - AGENTS.md

## 项目概述
Vue 3 + TypeScript + Vite 构建的三江源生态保护平台，包含前端展示和管理后台两个子项目。

## 构建和测试命令

### 主要前端项目
```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 类型检查
vue-tsc -b

# 构建并部署到 GitHub Pages
npm run deploy

# 预览构建结果
npm run preview
```

### 管理后台 (admin 目录)
```bash
cd admin

# 开发环境
npm run dev

# 生产构建
npm run build

# 类型检查
vue-tsc -b

# 预览构建结果
npm run preview
```

### 运行单个测试
```bash
# 如果项目有单元测试
npm run test:unit

# 如果项目有 E2E 测试
npm run test:e2e
```

## 代码风格指南

### 导入规范
```typescript
// 1. Vue 相关导入优先
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createPinia } from 'pinia'

// 2. 第三方库导入
import axios from 'axios'
import { ElButton, ElCard } from 'element-plus'

// 3. 本地组件和工具导入
import App from './App.vue'
import router from './router'
import './style.css'
```

### 组件命名规范
```typescript
// 组件文件名使用 PascalCase
UserProfile.vue
EcoDataChart.vue
NavigationHeader.vue

// 组件注册使用 PascalCase
<template>
  <UserProfile />
  <EcoDataChart />
</template>
```

### 变量和函数命名
```typescript
// 使用 camelCase
const userInfo = ref({})
const isLoading = computed(() => false)

// 函数名使用动词开头
const fetchUserData = async () => {}
const handleSubmitForm = () => {}

// 常量使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.sanjiangyuan.org'
const MAX_RETRY_COUNT = 3
```

### 类型定义规范
```typescript
// 接口使用 PascalCase，添加 I 前缀
interface IUser {
  id: number
  name: string
  email: string
}

// 类型别名使用 PascalCase
type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}

// 枚举使用 PascalCase
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}
```

### 错误处理规范
```typescript
// 使用 try-catch 包裹异步操作
const fetchEcoData = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('/api/eco-data')
    ecoData.value = response.data
  } catch (error) {
    console.error('Failed to fetch eco data:', error)
    // 使用 Element Plus 的消息提示
    ElMessage.error('获取生态数据失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 统一错误处理
const handleApiError = (error: any) => {
  if (error.response) {
    ElMessage.error(`服务器错误: ${error.response.status}`)
  } else if (error.request) {
    ElMessage.error('网络连接失败，请检查网络设置')
  } else {
    ElMessage.error('请求配置错误')
  }
}
```

### CSS/SCSS 样式规范
```scss
// 使用 CSS 变量遵循设计系统
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  // 使用语义化的类名
  &.component--highlighted {
    background-color: var(--accent-color);
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }
}
```

### 组件结构规范
```vue
<template>
  <!-- 模板内容，使用语义化标签 -->
  <section class="component-container">
    <header class="component-header">
      <h2>{{ title }}</h2>
    </header>
    <main class="component-content">
      <!-- 主要内容 -->
    </main>
  </section>
</template>

<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Props 定义
interface Props {
  title: string
  data?: any[]
}
const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

// 3. Emits 定义
interface Emits {
  update: [value: string]
  delete: [id: number]
}
const emit = defineEmits<Emits>()

// 4. 响应式数据
const isLoading = ref(false)
const localData = ref([])

// 5. 计算属性
const filteredData = computed(() => {
  return localData.value.filter(item => item.active)
})

// 6. 方法
const handleUpdate = (value: string) => {
  emit('update', value)
}

// 7. 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
// 组件样式，使用 scoped 避免样式污染
.component-container {
  padding: 20px;
  
  .component-header {
    margin-bottom: 16px;
  }
}
</style>
```

## 环境配置

### 环境变量
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_API_KEY=your_development_key

# .env.production
VITE_API_BASE_URL=https://api.sanjiangyuan.org
VITE_MAP_API_KEY=your_production_key
```

### Vite 配置要点
- 生产环境使用相对路径 `base: './'`
- 配置 Element Plus 自动导入
- 优化代码分割和资源管理

## 部署注意事项

### Vercel 部署
1. 确保 `vercel.json` 配置了正确的重写规则
2. 生产构建使用相对路径引用静态资源
3. Vue Router 使用 `createWebHistory(import.meta.env.BASE_URL)`

### 静态资源
- 图片放在 `public/assets/` 目录
- 大文件使用 CDN 加载
- 优先使用 SVG 格式的图标

## 第三方库使用规范

### Element Plus
```typescript
// 自动导入已配置，直接使用
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-card title="卡片标题">
    卡片内容
  </el-card>
</template>
```

### Axios 请求配置
```typescript
// 创建统一的请求实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(config => {
  // 添加认证 token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    handleApiError(error)
    return Promise.reject(error)
  }
)
```

## Git 工作流
```bash
# 功能分支开发
git checkout -b feature/eco-data-dashboard
git add .
git commit -m "feat: add eco data dashboard component"
git push origin feature/eco-data-dashboard

# 提交信息规范
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 性能优化建议
1. 使用 `v-memo` 优化列表渲染
2. 图片懒加载和 WebP 格式
3. 组件按需导入和代码分割
4. 使用 CDN 加载第三方库
5. 开启 Gzip 压缩和缓存策略