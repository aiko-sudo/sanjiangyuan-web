<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="header-content">
        <div class="user-avatar-wrapper">
          <el-avatar :src="userInfo.avatar" :size="100" class="user-avatar" />
          <el-button type="primary" size="small" class="edit-avatar-btn">
            <el-icon><Camera /></el-icon>
          </el-button>
        </div>
        <div class="user-info">
          <h1>{{ userInfo.nickname }}</h1>
          <div class="level-badge">
            <el-tag type="warning" size="large">
              {{ userInfo.level }}
            </el-tag>
          </div>
          <p class="user-intro">{{ userInfo.intro }}</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" plain>
            <el-icon><Edit /></el-icon>
            编辑资料
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="profile-container">
      <!-- 左侧用户数据 -->
      <aside class="user-stats-sidebar">
        <!-- 核心数据 -->
        <div class="stats-card card">
          <h3>📈 守护数据</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Coin /></el-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ userInfo.contribution }}</span>
                <span class="stat-label">贡献值</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ userInfo.guardianDays }}</span>
                <span class="stat-label">守护天数</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Grid /></el-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ userInfo.guardianGrids }}</span>
                <span class="stat-label">守护网格</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 守护日历 -->
        <div class="calendar-card card">
          <h3>📅 守护日历</h3>
          <el-calendar v-model="calendarDate">
            <template #date-cell="{ data }">
              <div 
                class="calendar-day"
                :class="{ 
                  'is-selected': data.isSelected,
                  'has-checkin': checkinData.includes(data.day)
                }"
              >
                {{ data.day.split('-').slice(2).join('-') }}
                <el-icon v-if="checkinData.includes(data.day)" class="checkin-icon">
                  <CircleCheck />
                </el-icon>
              </div>
            </template>
          </el-calendar>
          <p class="calendar-hint">连续打卡7天额外获得30贡献值</p>
        </div>
        
        <!-- 好友邀请 -->
        <div class="invite-card card">
          <h3>👥 好友邀请</h3>
          <p>邀请好友注册，双方各得50贡献值</p>
          <el-input v-model="inviteCode" readonly>
            <template #append>
              <el-button @click="copyInviteCode">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-input>
          <el-button type="primary" style="width: 100%; margin-top: 12px;" @click="shareInvite">
            分享邀请链接
          </el-button>
        </div>
      </aside>
      
      <!-- 右侧主要内容 -->
      <main class="main-content">
        <!-- 成就墙 -->
        <section class="achievements-section">
          <h2>🏆 成就墙</h2>
          <div class="achievements-grid">
            <div 
              v-for="badge in badges" 
              :key="badge.id"
              class="badge-item"
              :class="{ 'unlocked': badge.unlocked, 'locked': !badge.unlocked }"
            >
              <div class="badge-icon">
                <img :src="badge.icon" :alt="badge.name" />
              </div>
              <div class="badge-info">
                <span class="badge-name">{{ badge.name }}</span>
                <span class="badge-desc">{{ badge.desc }}</span>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 行为流水 -->
        <section class="activity-section">
          <h2>📋 行为流水</h2>
          <div class="activity-timeline">
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-dot"></div>
              <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-text">{{ activity.text }}</span>
                  <span 
                    class="activity-points"
                    :class="{ 'positive': activity.points > 0, 'negative': activity.points < 0 }"
                  >
                    {{ activity.points > 0 ? '+' : '' }}{{ activity.points }}贡献值
                  </span>
                </div>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 我的内容 -->
        <section class="my-content-section">
          <h2>📝 我的内容</h2>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="发布的帖子" name="posts">
              <div class="content-list">
                <div 
                  v-for="post in myPosts" 
                  :key="post.id"
                  class="content-item"
                >
                  <div class="content-preview">
                    <img :src="post.images[0]" v-if="post.images.length" />
                    <div class="no-image" v-else>📝</div>
                  </div>
                  <div class="content-info">
                    <h4>{{ post.title }}</h4>
                    <p>{{ post.summary }}</p>
                    <span class="content-stats">
                      <span><el-icon><Star /></el-icon>{{ post.likes }}</span>
                      <span><el-icon><ChatDotRound /></el-icon>{{ post.comments }}</span>
                      <span>{{ post.time }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="收藏" name="favorites">
              <div class="content-list">
                <div 
                  v-for="post in myFavorites" 
                  :key="post.id"
                  class="content-item"
                >
                  <div class="content-preview">
                    <img :src="post.images[0]" v-if="post.images.length" />
                  </div>
                  <div class="content-info">
                    <h4>{{ post.title }}</h4>
                    <p>{{ post.summary }}</p>
                    <span class="content-stats">
                      <span>{{ post.author }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>
        
        <!-- 设置 -->
        <section class="settings-section">
          <h2>⚙️ 设置</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <el-icon><Lock /></el-icon>
                <span>修改密码</span>
              </div>
              <el-button text type="primary">修改</el-button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <el-icon><Lock /></el-icon>
                <span>隐私设置</span>
              </div>
              <el-button text type="primary">设置</el-button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <el-icon><SwitchButton /></el-icon>
                <span>注销账户</span>
              </div>
              <el-button text type="danger">注销</el-button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Camera, Edit, Coin, Calendar, Grid, CircleCheck, 
  CopyDocument, Star, ChatDotRound, Lock, SwitchButton 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  nickname: '守护者阿青',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=阿青',
  level: '钻石守护者',
  intro: '三江源生态保护志愿者，致力于野生动物保护和非遗传承',
  contribution: 1280,
  guardianDays: 128,
  guardianGrids: 5
})

const checkinData = ref(['2024-07-10', '2024-07-11', '2024-07-12', '2024-07-13', '2024-07-14', '2024-07-15'])
const calendarDate = ref(new Date())
const inviteCode = ref('SJY2024AQTZ8X')
const activeTab = ref('posts')

const badges = ref([
  { id: '1', name: '首次发帖', desc: '发布第一篇守护故事', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827301.png', unlocked: true },
  { id: '2', name: '故事精选', desc: '内容被官方精选', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827349.png', unlocked: true },
  { id: '3', name: '守护100天', desc: '连续守护100天', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827357.png', unlocked: true },
  { id: '4', name: '网格守护者', desc: '认领第一个守护网格', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827366.png', unlocked: true },
  { id: '5', name: '云学徒毕业', desc: '完成云学徒课程', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827375.png', unlocked: false },
  { id: '6', name: '非遗守护者', desc: '守护非遗传承人', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827384.png', unlocked: false },
  { id: '7', name: '雪豹克星', desc: '发现雪豹踪迹10次', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827393.png', unlocked: false },
  { id: '8', name: '社区之星', desc: '获得1000次点赞', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827401.png', unlocked: false }
])

const activities = ref([
  { id: '1', text: '分享守护故事，获得20贡献值', points: 20, time: '2小时前' },
  { id: '2', text: '为才让扎西打call，消耗100贡献值', points: -100, time: '1天前' },
  { id: '3', text: '认领5号保护网格', points: 0, time: '3天前' },
  { id: '4', text: '每日登录打卡', points: 5, time: '4天前' },
  { id: '5', text: '评论优质内容', points: 2, time: '5天前' },
  { id: '6', text: '故事被官方精选', points: 100, time: '1周前' }
])

const myPosts = ref([
  { id: '1', title: '可可西里巡护日记', summary: '今天在巡护途中遇到了雪豹...', images: ['https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=200'], likes: 128, comments: 32, time: '2天前' },
  { id: '2', title: '非遗探访：唐卡绘制体验', summary: '跟着传承人学习唐卡绘制...', images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?w=200'], likes: 256, comments: 45, time: '1周前' }
])

const myFavorites = ref([
  { id: '1', title: '三江源雪豹监测报告', summary: '2024年第一季度雪豹种群监测...', images: ['https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200'], author: '阿青' },
  { id: '2', title: '氆氇编织技艺详解', summary: '传统氆氇编织的12道工序...', images: [], author: '卓玛吉' }
])

function copyInviteCode() {
  navigator.clipboard.writeText(inviteCode.value)
  ElMessage.success('邀请码已复制')
}

function shareInvite() {
  ElMessage.success('分享链接已复制')
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.profile-header {
  position: relative;
  background: var(--gradient-primary);
  padding: 60px 20px 100px;

  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1200') center/cover;
    opacity: 0.15;
  }

  .header-content {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 24px;
  }

  .user-avatar-wrapper {
    position: relative;

    .user-avatar {
      border: 4px solid #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .edit-avatar-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 8px;
      border-radius: 50%;
      background: var(--primary-color);
      color: #fff;
    }
  }

  .user-info {
    flex: 1;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .level-badge {
      margin-bottom: 8px;
    }

    .user-intro {
      font-size: 14px;
      opacity: 0.95;
    }
  }
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  margin-top: -60px;
}

.user-stats-sidebar {
  .card {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px var(--shadow-color);
    border: 1px solid var(--border-light);

    h3 {
      font-size: 16px;
      margin-bottom: 16px;
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .stats-grid {
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-secondary);
        color: var(--primary-color);
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }
  }

  .contribution-chart {
    margin-top: 24px;

    h4 {
      font-size: 14px;
      margin-bottom: 16px;
      color: var(--text-secondary);
    }

    .chart-wrapper {
      height: 150px;
      background: var(--bg-secondary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }
  }

  .stats-grid {
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        transform: translateX(4px);
      }

      .stat-icon {
        width: 44px;
        height: 44px;
        background: var(--gradient-primary);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
      }

      .stat-content {
        flex: 1;

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }
  }

  .calendar-card {
    :deep(.el-calendar) {
      .el-calendar-table {
        .el-calendar-day {
          height: 40px;
        }
      }
    }
    
    .calendar-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 12px;
      
      &.has-checkin {
        color: var(--primary-color);
        font-weight: 600;
      }
      
      .checkin-icon {
        font-size: 10px;
        margin-top: 2px;
      }
    }
    
    .calendar-hint {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 12px;
    }
  }
  
  .invite-card {
    p {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
  }
}

.main-content {
  padding-bottom: 60px;
  
  section {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    h2 {
      font-size: 18px;
      margin-bottom: 20px;
      color: var(--text-primary);
    }
  }
  
  .achievements-section {
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      
      .badge-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 12px;
        
        &.locked {
          opacity: 0.5;
          
          .badge-icon {
            filter: grayscale(100%);
          }
        }
        
        .badge-icon {
          width: 48px;
          height: 48px;
          
          img {
            width: 100%;
            height: 100%;
          }
        }
        
        .badge-info {
          .badge-name {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
          }
          
          .badge-desc {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }
    }
  }
  
  .activity-section {
    .activity-timeline {
      .activity-item {
        display: flex;
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid var(--border-light);
        
        &:last-child {
          border-bottom: none;
        }
        
        .activity-dot {
          width: 10px;
          height: 10px;
          background: var(--primary-color);
          border-radius: 50%;
          margin-top: 6px;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            top: 14px;
            left: 4px;
            width: 2px;
            height: calc(100% + 20px);
            background: var(--bg-secondary);
          }
          
          &:last-child::after {
            display: none;
          }
        }
        
        .activity-content {
          flex: 1;
          
          .activity-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            
            .activity-text {
              font-size: 14px;
              color: var(--text-primary);
            }
            
            .activity-points {
              font-size: 14px;
              font-weight: 600;
              color: var(--danger-color);
              
              &.positive {
                color: var(--primary-color);
              }
            }
          }
          
          .activity-time {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }
    }
  }
  
  .my-content-section {
    .content-list {
      .content-item {
        display: flex;
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid var(--border-light);
        
        &:last-child {
          border-bottom: none;
        }
        
        .content-preview {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .no-image {
            width: 100%;
            height: 100%;
            background: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
        }
        
        .content-info {
          flex: 1;
          
          h4 {
            font-size: 15px;
            margin-bottom: 8px;
            color: var(--text-primary);
          }
          
          p {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .content-stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: var(--text-muted);
            
            span {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
      }
    }
  }
  
  .settings-section {
    .settings-list {
      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid var(--border-light);
        
        &:last-child {
          border-bottom: none;
        }
        
        .setting-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
    margin-top: -40px;
  }
  
  .user-stats-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .card {
      margin-bottom: 0;
    }
  }
  
  .main-content .achievements-section .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-header .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-stats-sidebar {
    grid-template-columns: 1fr;
  }
  
  .main-content .achievements-section .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
