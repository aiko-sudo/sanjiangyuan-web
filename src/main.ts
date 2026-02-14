import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Element Plus 主题定制 - 基于三江源配色方案
// 使用 CSS 变量覆盖默认主题色
const elementPlusTheme = {
  // 主色系
  '--el-color-primary': 'var(--primary-color)',
  '--el-color-primary-light-3': '#40916C',
  '--el-color-primary-light-5': '#52B788',
  '--el-color-primary-light-7': '#74C69D',
  '--el-color-primary-light-8': '#95D5B2',
  '--el-color-primary-light-9': '#B7E4C7',
  '--el-color-primary-dark-2': '#1B4332',

  // 成功色
  '--el-color-success': 'var(--success-color)',
  '--el-color-success-light-3': '#52B788',
  '--el-color-success-light-5': '#74C69D',
  '--el-color-success-light-7': '#95D5B2',
  '--el-color-success-light-8': '#B7E4C7',
  '--el-color-success-light-9': '#D8F3DC',
  '--el-color-success-dark-2': '#1B4332',

  // 警告色
  '--el-color-warning': 'var(--warning-color)',
  '--el-color-warning-light-3': '#E8C972',
  '--el-color-warning-light-5': '#E8B732',
  '--el-color-warning-light-7': '#E0A519',
  '--el-color-warning-light-8': '#D69E2E',
  '--el-color-warning-light-9': '#D4A84B',
  '--el-color-warning-dark-2': '#B8922E',

  // 危险色
  '--el-color-danger': 'var(--danger-color)',
  '--el-color-danger-light-3': '#E05A3C',
  '--el-color-danger-light-5': '#D64545',
  '--el-color-danger-light-7': '#C23B22',
  '--el-color-danger-light-8': '#B02D1E',
  '--el-color-danger-light-9': '#9B2D1A',
  '--el-color-danger-dark-2': '#9B2D1A',

  // 信息色
  '--el-color-info': 'var(--info-color)',
  '--el-color-info-light-3': '#7BC4D4',
  '--el-color-info-light-5': '#4A90A4',
  '--el-color-info-light-7': '#2C6E80',
  '--el-color-info-light-8': '#1E5664',
  '--el-color-info-light-9': '#184D5A',
  '--el-color-info-dark-2': '#1E5664',

  // 文字颜色
  '--el-text-color-primary': 'var(--text-primary)',
  '--el-text-color-regular': 'var(--text-secondary)',
  '--el-text-color-secondary': 'var(--text-muted)',
  '--el-text-color-placeholder': 'var(--text-muted)',

  // 背景颜色
  '--el-bg-color': 'var(--bg-primary)',
  '--el-bg-color-page': 'var(--bg-primary)',
  '--el-bg-color-overlay': 'var(--bg-white)',

  // 边框颜色
  '--el-border-color': 'var(--border-color)',
  '--el-border-color-light': 'var(--border-light)',
  '--el-border-color-lighter': '#E8ECF1',

  // 填充颜色
  '--el-fill-color-blank': 'var(--bg-white)',

  // 阴影颜色
  '--el-box-shadow': '0 4px 16px var(--shadow-color)',
  '--el-box-shadow-light': '0 2px 8px var(--shadow-color)',
  '--el-box-shadow-lighter': '0 1px 4px rgba(45, 106, 79, 0.08)',

  // 过渡颜色
  '--el-transition-duration': '0.3s',
  '--el-transition-duration-fast': '0.2s',
}

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 应用 Element Plus 主题变量
Object.entries(elementPlusTheme).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value)
})

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
