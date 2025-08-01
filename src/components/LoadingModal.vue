<template>
  <Teleport to="body">
    <Transition name="loading-fade" appear>
      <div 
        v-if="visible" 
        class="loading-overlay"
        @click.self="$emit('close')"
      >
        <Transition name="loading-scale" appear>
          <div v-if="visible" class="loading-modal">
            <div class="loading-content">
              <!-- 自定义加载动画 -->
              <div class="custom-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
              
              <!-- 加载文本 -->
              <div class="loading-text">
                <span class="text-lg font-medium text-base-content">{{ message }}</span>
                <div class="loading-dots">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '正在加载数据'
  },
  showDelay: {
    type: Number,
    default: 500 // 显示延时500ms，防止快速闪现
  },
  minShowTime: {
    type: Number,
    default: 1000 // 最小显示时间1秒
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
const isShowing = ref(false)
let showTimer = null
let hideTimer = null
let showStartTime = null

// 监听show属性变化
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 清除可能存在的隐藏定时器
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    
    // 如果还没有开始显示，设置延时显示
    if (!isShowing.value) {
      showTimer = setTimeout(() => {
        visible.value = true
        isShowing.value = true
        showStartTime = Date.now()
      }, props.showDelay)
    }
  } else {
    // 清除显示定时器
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
      return
    }
    
    // 如果正在显示，检查是否已经显示足够长时间
    if (isShowing.value && showStartTime) {
      const elapsedTime = Date.now() - showStartTime
      const remainingTime = Math.max(0, props.minShowTime - elapsedTime)
      
      hideTimer = setTimeout(() => {
        visible.value = false
        // 等待淡出动画完成后重置状态
        setTimeout(() => {
          isShowing.value = false
          showStartTime = null
        }, 1000) // 与淡出动画时间一致
      }, remainingTime)
    }
  }
}, { immediate: true })

// 清理定时器
const cleanup = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(cleanup)
</script>

<style scoped>
/* 遮罩层样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.05); /* 更轻微的半透明背景 */
  backdrop-filter: blur(1px); /* 轻微模糊效果 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 弹窗主体 */
.loading-modal {
  background: #ffffff; /* 纯白色背景 */
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-width: 320px;
  max-width: 420px;
  position: relative;
}

/* 加载内容容器 */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* 自定义加载动画 */
.custom-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #3b82f6;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #8b5cf6;
  animation-delay: -0.4s;
  width: 75%;
  height: 75%;
  top: 12.5%;
  left: 12.5%;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #06b6d4;
  animation-delay: -0.8s;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 加载文本样式 */
.loading-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* 跳动的点 */
.loading-dots {
  display: flex;
  gap: 4px;
  margin-top: 0.5rem;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 遮罩层淡入淡出动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* 弹窗缩放动画 */
.loading-scale-enter-active,
.loading-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.loading-scale-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.loading-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .loading-modal {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .loading-overlay {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .loading-modal {
    margin: 1rem;
    padding: 1.5rem;
    min-width: auto;
    width: calc(100% - 2rem);
    max-width: none;
  }
  
  .custom-spinner {
    width: 50px;
    height: 50px;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .custom-spinner,
  .dot {
    animation: none;
  }
  
  .loading-fade-enter-active,
  .loading-fade-leave-active,
  .loading-scale-enter-active,
  .loading-scale-leave-active {
    transition: none;
  }
}
</style>