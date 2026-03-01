<template>
  <div v-if="visible" class="ad-banner-container" :className="customClass">
    <a :href="link" target="_blank" class="ad-link">
      <div class="ad-content" :style="{ backgroundImage: `url(${image})` }">
        <div class="ad-tag">广告</div>
        <div class="ad-text" v-if="title">
          <h3>{{ title }}</h3>
        </div>
      </div>
    </a>
    <button class="close-btn" @click.prevent="closeAd">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  image: string
  link: string
  title?: string
  customClass?: string
}>()

const visible = ref(true)

const closeAd = () => {
  visible.value = false
}
</script>

<style scoped lang="scss">
.ad-banner-container {
  position: relative;
  width: 100%;
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
}

.ad-link {
  display: block;
  text-decoration: none;
  width: 100%;
}

.ad-content {
  height: 120px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    transition: background 0.3s;
  }
  
  &:hover::before {
    background: rgba(0,0,0,0.2);
  }
}

.ad-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.4);
  color: rgba(255,255,255,0.8);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.ad-text {
  position: relative;
  z-index: 2;
  text-align: center;
  
  h3 {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    margin: 0;
    letter-spacing: 2px;
  }
}

.close-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
  
  &:hover {
    background: rgba(255,255,255,0.4);
  }
}

.ad-banner-container:hover .close-btn {
  opacity: 1;
}

@media (max-width: 768px) {
  .ad-content {
    height: 80px;
    
    .ad-text h3 {
      font-size: 1rem;
    }
  }
}
</style>
