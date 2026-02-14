<template>
  <div class="crafts-page">
    <div class="page-header">
      <h1>非遗技艺</h1>
      <p>探寻千年技艺，传承文化血脉</p>
    </div>
    
    <div class="container">
      <!-- 传承人矩阵 -->
      <section class="craftsmen-section">
        <div class="section-header">
          <h2>传承人矩阵</h2>
          <div class="filter-tabs">
            <el-radio-group v-model="activeFilter" size="large">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="thangka">唐卡</el-radio-button>
              <el-radio-button label="embroidery">堆绣</el-radio-button>
              <el-radio-button label="pulu">氆氇</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <div class="craftsmen-grid">
          <div 
            v-for="craftsman in filteredCraftsmen" 
            :key="craftsman.id" 
            class="craftsman-card"
            @click="showCraftsmanDetail(craftsman)"
          >
            <div class="card-image">
              <img :src="craftsman.avatar" :alt="craftsman.name" />
              <div class="card-overlay">
                <span>查看详情</span>
              </div>
              <div class="guardian-badge">
                <el-icon><Star /></el-icon>
                {{ craftsman.guardians }}人守护
              </div>
            </div>
            <div class="card-info">
              <h3>{{ craftsman.name }}</h3>
              <div class="skill-tags">
                <el-tag 
                  v-for="skill in craftsman.skills" 
                  :key="skill"
                  size="small"
                  effect="plain"
                >
                  {{ skill }}
                </el-tag>
              </div>
              <div class="craftsman-level">
                <el-tag :type="getLevelType(craftsman.level)" size="small">
                  {{ craftsman.level }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 技艺守护榜 -->
      <section class="ranking-section">
        <h2>🔥 技艺守护榜</h2>
        <div class="ranking-list">
          <div 
            v-for="(skill, index) in skillRankings" 
            :key="skill.id" 
            class="ranking-item"
          >
            <span class="rank-num" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
            <span class="skill-name">{{ skill.name }}</span>
            <el-progress 
              :percentage="skill.percentage" 
              :stroke-width="8"
              :color="skill.color"
              class="skill-progress"
            />
            <span class="skill-count">{{ skill.count }}人</span>
          </div>
        </div>
      </section>
    </div>
    
    <!-- 传承人详情抽屉 -->
    <el-drawer
      v-model="showDetail"
      :title="selectedCraftsman?.name"
      size="600px"
      direction="rtl"
    >
      <div v-if="selectedCraftsman" class="craftsman-detail">
        <!-- 头部信息 -->
        <div class="detail-header">
          <div class="avatar-wrapper">
            <img :src="selectedCraftsman.avatar" :alt="selectedCraftsman.name" class="detail-avatar" />
          </div>
          <div class="basic-info">
            <h2>{{ selectedCraftsman.name }}</h2>
            <el-tag :type="getLevelType(selectedCraftsman.level)" size="large">
              {{ selectedCraftsman.level }}
            </el-tag>
            <p class="intro">{{ selectedCraftsman.intro }}</p>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-value">{{ selectedCraftsman.years }}</span>
                <span class="stat-label">从业年限</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedCraftsman.students }}</span>
                <span class="stat-label">传承学生</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedCraftsman.works }}</span>
                <span class="stat-label">代表作品</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 关注按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="large">
            <el-icon><Plus /></el-icon>
            关注
          </el-button>
          <el-button type="warning" size="large" @click="showLearningDialog = true">
            <el-icon><VideoCamera /></el-icon>
            云学徒（500贡献值/30分钟）
          </el-button>
        </div>
        
        <!-- 创作日志 -->
        <div class="activity-section">
          <h3>创作日志</h3>
          <div class="activity-timeline">
            <div class="activity-item" v-for="activity in selectedCraftsman.activities" :key="activity.id">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.content }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 技艺库 -->
        <div class="skills-section">
          <h3>技艺库</h3>
          <div class="skills-grid">
            <div 
              v-for="(step, index) in selectedCraftsman.skillsSteps" 
              :key="index"
              class="skill-step-card"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <img :src="step.image" :alt="step.title" class="step-image" />
              <h4>{{ step.title }}</h4>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
        
        <!-- 求助通道 -->
        <div class="help-section">
          <h3>求助通道</h3>
          <el-input
            v-model="helpQuestion"
            type="textarea"
            :rows="3"
            placeholder="给传承人留言提问..."
          />
          <el-button type="primary" style="margin-top: 12px;" @click="submitQuestion">
            提交问题
          </el-button>
        </div>
      </div>
    </el-drawer>
    
    <!-- 云学徒对话框 -->
    <el-dialog v-model="showLearningDialog" title="预约云学徒" width="500px">
      <div class="learning-dialog">
        <div class="learning-info">
          <img :src="selectedCraftsman?.avatar" :alt="selectedCraftsman?.name" class="learning-avatar" />
          <div>
            <h4>{{ selectedCraftsman?.name }}</h4>
            <p>30分钟一对一视频学习</p>
          </div>
        </div>
        <el-calendar v-model="learningDate" />
        <el-time-picker
          v-model="learningTime"
          placeholder="选择时间"
          format="HH:mm"
          style="width: 100%; margin-top: 16px;"
        />
        <div class="cost-info">
          <span>费用：</span>
          <strong>500贡献值</strong>
        </div>
      </div>
      <template #footer>
        <el-button @click="showLearningDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmLearning">确认预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, Plus, VideoCamera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Craftsman {
  id: string
  name: string
  avatar: string
  level: string
  skills: string[]
  guardians: number
  intro: string
  years: number
  students: number
  works: number
  activities: { id: string; content: string; time: string }[]
  skillsSteps: { image: string; title: string; desc: string }[]
  category: string
}

const craftsmen = ref<Craftsman[]>([
  {
    id: '1',
    name: '才让扎西',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    level: '国家级传承人',
    skills: ['唐卡绘制', '堆绣工艺'],
    guardians: 3872,
    intro: '青海省非遗唐卡代表性传承人，从事唐卡绘制40余年，培养学徒数百人。',
    years: 42,
    students: 128,
    works: 56,
    category: 'thangka',
    activities: [
      { id: '1', content: '今日完成唐卡开脸工序，历时3小时', time: '2小时前' },
      { id: '2', content: '教授3名新学徒矿物颜料研磨技巧', time: '1天前' },
      { id: '3', content: '参加非遗进校园活动', time: '3天前' }
    ],
    skillsSteps: [
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '起稿', desc: '用铅笔在画布上勾勒图案' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '上色', desc: '使用矿物颜料层层渲染' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '开脸', desc: '绘制佛像面部细节' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '开光', desc: '作品完成后进行开光仪式' }
    ]
  },
  {
    id: '2',
    name: '卓玛吉',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    level: '省级传承人',
    skills: ['氆氇编织', '藏装制作'],
    guardians: 2456,
    intro: '西藏自治区氆氇编织技艺传承人，传承藏地传统纺织工艺。',
    years: 28,
    students: 56,
    works: 89,
    category: 'pulu',
    activities: [
      { id: '1', content: '今日编织氆氇3小时，完成一半', time: '5小时前' },
      { id: '2', content: '研究传统天然染料配方', time: '2天前' }
    ],
    skillsSteps: [
      { image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300', title: '选毛', desc: '精选优质羊毛纤维' },
      { image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300', title: '纺线', desc: '手工纺制毛线' },
      { image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300', title: '染色', desc: '使用天然植物染色' },
      { image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300', title: '编织', desc: '传统织机编织氆氇' }
    ]
  },
  {
    id: '3',
    name: '扎西多杰',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    level: '省级传承人',
    skills: ['堆绣制作', '唐卡修复'],
    guardians: 1890,
    intro: '青海省堆绣代表性传承人，精通堆绣技艺与古画修复。',
    years: 35,
    students: 42,
    works: 67,
    category: 'embroidery',
    activities: [
      { id: '1', content: '完成一幅堆绣作品的最后收尾工作', time: '1天前' },
      { id: '2', content: '修复一幅清代唐卡', time: '4天前' }
    ],
    skillsSteps: [
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '设计', desc: '设计堆绣图案' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '裁剪', desc: '裁剪各色绸缎' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '堆贴', desc: '层层堆贴形成立体效果' },
      { image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300', title: '缝制', desc: '精细缝制固定' }
    ]
  },
  {
    id: '4',
    name: '仁青措',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    level: '市级传承人',
    skills: ['藏香制作', '传统手工艺'],
    guardians: 1234,
    intro: '藏香制作技艺传承人，致力于传统藏香的研发与传承。',
    years: 20,
    students: 25,
    works: 45,
    category: 'pulu',
    activities: [
      { id: '1', content: '研发新型藏香配方', time: '3天前' }
    ],
    skillsSteps: [
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', title: '配料', desc: '采集天然香料' },
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', title: '研磨', desc: '研磨成粉' },
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', title: '调配', desc: '按古方调配' },
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', title: '成型', desc: '手工挤压成香' }
    ]
  }
])

const skillRankings = ref([
  { id: '1', name: '唐卡绘制', count: 5678, percentage: 85, color: 'var(--accent-color)' },
  { id: '2', name: '氆氇编织', count: 4321, percentage: 65, color: 'var(--secondary-color)' },
  { id: '3', name: '堆绣工艺', count: 3456, percentage: 52, color: 'var(--primary-color)' },
  { id: '4', name: '藏香制作', count: 2345, percentage: 35, color: 'var(--tertiary-color)' },
  { id: '5', name: '藏装制作', count: 1890, percentage: 28, color: 'var(--accent-dark)' }
])

const activeFilter = ref('all')
const showDetail = ref(false)
const showLearningDialog = ref(false)
const selectedCraftsman = ref<Craftsman | null>(null)
const helpQuestion = ref('')
const learningDate = ref(new Date())
const learningTime = ref(new Date())

const filteredCraftsmen = computed(() => {
  if (activeFilter.value === 'all') return craftsmen.value
  return craftsmen.value.filter(c => c.category === activeFilter.value)
})

function getLevelType(level: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '国家级传承人': 'danger',
    '省级传承人': 'warning',
    '市级传承人': 'primary'
  }
  return types[level] || 'info'
}

function showCraftsmanDetail(craftsman: Craftsman) {
  selectedCraftsman.value = craftsman
  showDetail.value = true
}

function submitQuestion() {
  if (!helpQuestion.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }
  ElMessage.success('问题已提交，官方筛选后将统一回复')
  helpQuestion.value = ''
}

function confirmLearning() {
  ElMessage.success('预约成功！将在24小时内确认具体时间')
  showLearningDialog.value = false
}
</script>

<style scoped lang="scss">
.crafts-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 60px;
}

.page-header {
  background: var(--gradient-primary);
  color: #fff;
  padding: 60px 20px;
  text-align: center;

  h1 {
    font-size: 36px;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    opacity: 0.95;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h2 {
    font-size: 24px;
    color: var(--text-primary);
  }
}

.craftsmen-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.craftsman-card {
  background: var(--bg-white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px var(--shadow-color);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px var(--shadow-color);

    .card-overlay {
      opacity: 1;
    }
  }

  .card-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      span {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .guardian-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: var(--bg-dark-overlay);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      backdrop-filter: blur(4px);
    }
  }

  .card-info {
    padding: 16px;
    text-align: center;

    h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .skill-tags {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
  }
}

.ranking-section {
  background: var(--bg-white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px var(--shadow-color);

  h2 {
    font-size: 20px;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-weight: 600;
  }

  .ranking-list {
    .ranking-item {
      display: flex;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        transform: translateX(4px);
      }

      .rank-num {
        width: 32px;
        height: 32px;
        background: var(--gradient-accent);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        margin-right: 14px;
        box-shadow: 0 2px 8px rgba(212, 168, 75, 0.3);
      }

      &:nth-child(1) .rank-num {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      }

      &:nth-child(2) .rank-num {
        background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
      }

      &:nth-child(3) .rank-num {
        background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
      }

      .rank-info {
        flex: 1;

        .rank-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .rank-detail {
          font-size: 12px;
          color: var(--text-muted);
        }
      }

      .rank-value {
        font-size: 16px;
        font-weight: 700;
        color: var(--primary-color);
      }
    }
  }
  
  .card-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(30, 154, 95, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      span {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .guardian-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
  
  .card-info {
    padding: 16px;
    text-align: center;
    
    h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--text-primary);
    }
    
    .skill-tags {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
  }
}

.ranking-section {
  background: var(--bg-white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px var(--shadow-color);

  h2 {
    font-size: 20px;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-weight: 600;
  }

  .ranking-list {
    .ranking-item {
      display: flex;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        transform: translateX(4px);
      }

      .rank-num {
        width: 32px;
        height: 32px;
        background: var(--bg-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        margin-right: 14px;
        color: var(--text-secondary);

        &.top-three {
          background: var(--accent-color);
          color: #fff;
          box-shadow: 0 2px 8px rgba(212, 168, 75, 0.3);
        }
      }

      .skill-name {
        width: 100px;
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 500;
      }

      .skill-progress {
        flex: 1;
        margin: 0 16px;
      }

      .skill-count {
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
      }
    }
  }
}

.craftsman-detail {
  .detail-header {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    
    .avatar-wrapper {
      .detail-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid var(--accent-color);
      }
    }
    
    .basic-info {
      flex: 1;
      
      h2 {
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .intro {
        color: var(--text-secondary);
        margin: 16px 0;
        line-height: 1.6;
      }
      
      .stats-row {
        display: flex;
        gap: 32px;
        
        .stat-item {
          text-align: center;
          
          .stat-value {
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: var(--primary-color);
          }
          
          .stat-label {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-light);
  }
  
  .activity-section,
  .skills-section,
  .help-section {
    margin-bottom: 32px;
    
    h3 {
      font-size: 18px;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
  }
  
  .activity-timeline {
    .activity-item {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      
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
        
        .activity-text {
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        
        .activity-time {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .skill-step-card {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 16px;
      position: relative;
      
      .step-number {
        position: absolute;
        top: -8px;
        left: -8px;
        width: 28px;
        height: 28px;
        background: var(--primary-color);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
      }
      
      .step-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      
      h4 {
        font-size: 14px;
        margin-bottom: 8px;
        color: var(--text-primary);
      }
      
      p {
        font-size: 12px;
        color: var(--text-muted);
      }
    }
  }
}

.learning-dialog {
  .learning-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    
    .learning-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    h4 {
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 14px;
      color: var(--text-muted);
    }
  }
  
  .cost-info {
    margin-top: 16px;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: 8px;
    
    strong {
      color: var(--accent-color);
      font-size: 20px;
    }
  }
}

@media (max-width: 1024px) {
  .craftsmen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .craftsmen-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .craftsman-detail .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
