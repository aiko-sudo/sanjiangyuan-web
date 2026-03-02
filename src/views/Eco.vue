<template>
  <div class="eco-page">
    <div class="page-header-common" style="background-image: url('/sheli_01.jpg');">
    <div class="header-content">
      <h1>生态数据中心</h1>
      <p>用数据守护三江源 · 透明 · 参与 · 行动</p>
    </div>
  </div>
    
    <div class="eco-container">
      <!-- 左侧地图区域 -->
      <section class="map-section">
        <div class="map-container shadow-sm">
          <div id="map" class="leaflet-map"></div>
        </div>
        
        <!-- 我的守护网格 -->
        <div class="my-guardian-grid">
          <h3>我的守护网格</h3>
          <div class="grid-info">
            <el-tag type="success" size="large">
              已认领 5 个网格
            </el-tag>
            <span class="grid-hint">点击地图高亮区域查看详情</span>
          </div>
          <div class="grid-stats">
            <div class="stat-item">
              <span class="stat-value">5</span>
              <span class="stat-label">守护网格</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">32</span>
              <span class="stat-label">发现雪豹(次)</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">156</span>
              <span class="stat-label">巡护里程(km)</span>
            </div>
          </div>
        </div>

        <!-- 生态故事 -->
        <div class="eco-story-section card mt-4">
          <div class="story-header">
            <h3>📖 生态故事</h3>
          </div>
          <div class="story-content" v-if="ecoStory">
            <p v-for="(p, i) in ecoStory.split('\n')" :key="i">{{ p }}</p>
          </div>
          <el-skeleton v-else :rows="5" animated />
        </div>
      </section>
      
      <!-- 右侧数据面板 -->
      <aside class="data-panel">
        <!-- 数据墙 -->
        <div class="data-wall card">
          <h3>📊 数据墙</h3>
          
          <!-- 捐赠金额柱状图 -->
          <div class="chart-container">
            <h4>各保护站受捐金额对比</h4>
            <canvas ref="donationChartRef" class="chart-canvas"></canvas>
          </div>
          
          <!-- 资金用途饼图 -->
          <div class="chart-container">
            <h4>资金用途分布</h4>
            <canvas ref="fundChartRef" class="chart-canvas"></canvas>
          </div>
          
          <!-- 雪豹监测折线图 -->
          <div class="chart-container">
            <h4>雪豹监测数量月度变化</h4>
            <canvas ref="snowLeopardChartRef" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <!-- 紧急响应 -->
        <div class="urgent-notice card">
          <div class="notice-header">
            <el-icon><Warning /></el-icon>
            <span>紧急响应</span>
          </div>
          <div class="notice-content">
            <h4>需要您的支持！</h4>
            <p>可可西里不冻泉保护站巡护装备急需更新</p>
            <div class="progress-wrapper">
              <el-progress :percentage="68" :stroke-width="10" status="exception" />
              <div class="progress-info">
                <span>¥3,400 / ¥5,000</span>
                <span>还差 ¥1,600</span>
              </div>
            </div>
            <el-button type="danger" size="large" style="width: 100%; margin-top: 16px;">
              立即捐赠
            </el-button>
          </div>
        </div>
        
        <!-- 物种图鉴 -->
        <div class="species-gallery card">
          <h3>🦊 物种图鉴</h3>
          <div class="species-grid">
            <div 
              v-for="species in speciesList" 
              :key="species.id" 
              class="species-item"
            >
              <img :src="species.image" :alt="species.name" />
              <div class="species-info">
                <span class="species-name">{{ species.name }}</span>
                <el-tag size="small" :type="(species.rarity === 'rare' ? 'danger' : 'info') as 'danger' | 'info'">
                  {{ species.rarity === 'rare' ? '稀有' : '常见' }}
                </el-tag>
              </div>
            </div>
          </div>
          <el-button type="primary" plain style="width: 100%; margin-top: 16px;">
            解锁更多物种（需200贡献值）
          </el-button>
        </div>
        
        <!-- VR云探访 -->
        <div class="vr-section card">
          <h3>🌐 VR云探访</h3>
          <div class="vr-preview">
            <img src="/kkxl.png?w=400" alt="VR预览" />
            <div class="vr-badge">
              <el-icon><VideoCamera /></el-icon>
              LIVE
            </div>
          </div>
          <h4>可可西里不冻泉保护站</h4>
          <p>每月一次 · 上次直播：3天前</p>
          <el-button type="success" style="width: 100%; margin-top: 16px;">
            进入VR探访
          </el-button>
        </div>
      </aside>
    </div>
    
    <!-- 保护站详情弹窗 -->
    <el-dialog
      v-model="showStationDialog"
      :title="selectedStation?.name"
      width="500px"
    >
      <div v-if="selectedStation" class="station-detail">
        <div class="station-header">
          <img :src="selectedStation.image" :alt="selectedStation.name" class="station-image" />
        </div>
        
        <div class="station-info">
          <div class="info-row">
            <span class="label">守护人：</span>
            <span class="value">{{ selectedStation.guardian }}</span>
            <el-tag size="small" type="success">在线</el-tag>
          </div>
          <div class="info-row">
            <span class="label">今日巡护里程：</span>
            <span class="value text-primary">{{ selectedStation.patrolDistance }}km</span>
          </div>
          <div class="info-row">
            <span class="label">本周发现野生动物：</span>
            <span class="value">{{ selectedStation.wildlifeCount }}次</span>
          </div>
        </div>
        
        <div class="station-actions">
          <el-button type="primary" @click="viewRealtimePatrol">
            <el-icon><View /></el-icon>
            查看实时巡护轨迹
          </el-button>
          <el-button type="warning" @click="adoptGrid">
            <el-icon><Plus /></el-icon>
            认领该网格
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Warning, VideoCamera, View, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Chart as ChartType } from 'chart.js'
import type * as Leaflet from 'leaflet'

// 使用全局的 Chart.js 和 Leaflet (通过 CDN 加载)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Chart: any = (window as any).Chart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L: typeof Leaflet = (window as any).L

interface Station {
  id: string
  name: string
  lat: number
  lng: number
  guardian: string
  patrolDistance: number
  wildlifeCount: number
  image: string
}

const stations = ref<Station[]>([
  { id: '1', name: '可可西里不冻泉保护站', lat: 35.23, lng: 93.30, guardian: '阿青', patrolDistance: 23, wildlifeCount: 12, image: '/kkxl.png' },
  { id: '2', name: '沱沱河保护站', lat: 34.21, lng: 92.43, guardian: '扎西', patrolDistance: 18, wildlifeCount: 8, image: '/zanglingyang-01.jpg' },
  { id: '3', name: '索加保护站', lat: 33.56, lng: 94.21, guardian: '卓玛', patrolDistance: 32, wildlifeCount: 15, image: '/zanghu_01.jpg' }
])

const speciesList = ref([
  { id: '1', name: '雪豹', image: '/xuebao_01.jpg', rarity: 'rare' },
  { id: '2', name: '藏羚羊', image: '/zanglingyang-01.jpg', rarity: 'common' },
  { id: '3', name: '藏狐', image: '/zanghu_01.jpg', rarity: 'common' },
  { id: '4', name: '兔狲', image: '/tusun_01.jpg', rarity: 'rare' }
])

const donationChartRef = ref<HTMLCanvasElement | null>(null)
const fundChartRef = ref<HTMLCanvasElement | null>(null)
const snowLeopardChartRef = ref<HTMLCanvasElement | null>(null)

const showStationDialog = ref(false)
const selectedStation = ref<Station | null>(null)
const ecoStory = ref('')

async function fetchEcoStory() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/settings/eco_story`)
    if (res.ok) {
      const data = await res.json()
      ecoStory.value = data.value
    }
  } catch (err) {
    console.error('Failed to fetch eco story:', err)
  }
}

let donationChart: ChartType | null = null
let fundChart: ChartType | null = null
let snowLeopardChart: ChartType | null = null

function initCharts() {
  if (!Chart) {
    console.warn('Chart.js not loaded yet')
    return
  }

  // 捐赠柱状图
  if (donationChartRef.value) {
    donationChart = new Chart(donationChartRef.value, {
      type: 'bar',
      data: {
        labels: ['不冻泉', '沱沱河', '索加', '扎陵湖', '鄂陵湖'],
        datasets: [{
          label: '受捐金额(万元)',
          data: [12.5, 8.3, 15.6, 9.8, 11.2],
          backgroundColor: [
            'var(--primary-color)',
            'var(--primary-light)',
            'var(--accent-color)',
            'var(--secondary-color)',
            'var(--accent-dark)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    })
  }
  
  // 资金用途饼图
  if (fundChartRef.value) {
    fundChart = new Chart(fundChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['巡护', '设备', '社区'],
        datasets: [{
          data: [60, 25, 15],
          backgroundColor: ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)']
        }]
      },
      options: {
        responsive: true
      }
    })
  }
  
  // 雪豹监测折线图
  if (snowLeopardChartRef.value) {
    snowLeopardChart = new Chart(snowLeopardChartRef.value, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
          label: '监测次数',
          data: [15, 18, 22, 28, 32, 35],
          borderColor: 'var(--primary-color)',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(45, 106, 79, 0.15)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    })
  }
}

function showStationDetail(station: Station) {
  selectedStation.value = station
  showStationDialog.value = true
}

function viewRealtimePatrol() {
  ElMessage.info('正在连接实时巡护轨迹...')
}

function adoptGrid() {
  ElMessage.success('认领成功！该网格已加入您的守护范围')
  showStationDialog.value = false
}

let map: L.Map | null = null

function initMap() {
  if (!L) {
    console.warn('Leaflet not loaded yet')
    return
  }
  
  const mapEl = document.getElementById('map')
  if (!mapEl) return

  try {
    // 初始化地图中心点（三江源区域）
    map = L.map('map', {
      center: [34.50, 93.50],
      zoom: 6,
      zoomControl: false
    })

    // 添加卫星底图层
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    }).addTo(map)
  } catch (error) {
    console.error('Failed to initialize map:', error)
    return
  }

  // 添加保护站标记
  stations.value.forEach(station => {
    const customIcon = L.divIcon({
      className: 'custom-station-marker',
      html: `
        <div class="marker-wrapper">
          <div class="marker-icon"><i class="el-icon-Location"></i></div>
          <div class="marker-label">${station.name}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map!)
    marker.on('click', () => {
      showStationDetail(station)
    })
  })
}

onMounted(async () => {
  initCharts()
  await nextTick()
  initMap()
  fetchEcoStory()
})

onUnmounted(() => {
  donationChart?.destroy()
  fundChart?.destroy()
  snowLeopardChart?.destroy()
})
</script>

<style scoped lang="scss">
.eco-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-header {
  background: var(--gradient-primary);
  color: #fff;
  padding: 40px 20px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.9;
  }
}

.eco-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.map-section {
  .map-container {
    position: relative;
    background: var(--primary-dark);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 20px;
    
    .leaflet-map {
      width: 100%;
      height: 600px;
      background: #1a3a5c;
      z-index: 1;
    }
  }

  :deep(.custom-station-marker) {
    .marker-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .marker-icon {
        width: 32px;
        height: 32px;
        background: var(--accent-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
        border: 2px solid #fff;
        
        &::before {
          content: '📍';
          font-size: 14px;
        }
      }
      
      .marker-label {
        margin-top: 6px;
        background: rgba(26, 58, 92, 0.9);
        color: #fff;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        white-space: nowrap;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }
  }
  
  .my-guardian-grid {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      font-size: 18px;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
    
    .grid-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      
      .grid-hint {
        font-size: 12px;
        color: var(--text-muted);
      }
    }
    
    .grid-stats {
      display: flex;
      gap: 32px;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }
  }

  .eco-story-section {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .story-header {
      margin-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 12px;
      
      h3 {
        font-size: 20px;
        color: var(--primary-color);
        margin: 0;
      }
    }

    .story-content {
      p {
        font-size: 15px;
        line-height: 1.8;
        color: #444;
        margin-bottom: 16px;
        text-indent: 2em;
        text-align: justify;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.mt-4 { margin-top: 1.5rem; }

.data-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .card {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      font-size: 16px;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
  }
  
  .chart-container {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h4 {
      font-size: 14px;
      margin-bottom: 12px;
      color: var(--text-secondary);
    }
    
    .chart-canvas {
      max-height: 150px;
    }
  }
  
  .urgent-notice {
    background: var(--danger-color);
    color: #fff;
    
    .notice-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .notice-content {
      h4 {
        font-size: 16px;
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 16px;
      }
      
      .progress-wrapper {
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          opacity: 0.9;
        }
      }
    }
  }
  
  .species-gallery {
    .species-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .species-item {
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-secondary);
        
        img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        
        .species-info {
          padding: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .species-name {
            font-size: 12px;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .vr-section {
    .vr-preview {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
      
      img {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
      }
      
      .vr-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--danger-color);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    h4 {
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
}

.station-detail {
  .station-header {
    margin-bottom: 20px;
    
    .station-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
    }
  }
  
  .station-info {
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-light);
      
      .label {
        color: var(--text-muted);
        min-width: 120px;
      }
      
      .value {
        font-weight: 500;
        
        &.text-primary {
          color: var(--primary-color);
        }
      }
    }
  }
  
  .station-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
}

@media (max-width: 1024px) {
  .eco-container {
    grid-template-columns: 1fr;
  }
}
</style>
