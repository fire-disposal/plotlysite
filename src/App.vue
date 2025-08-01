<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主内容区域 -->
    <main class="container mx-auto px-4 py-6">
      <!-- 路由视图 -->
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <KeepAlive>
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
    
    <!-- 全局加载状态 - 使用新的LoadingModal组件 -->
    <LoadingModal
      :show="isLoading"
      message="正在加载数据..."
      :show-delay="500"
      :min-show-time="1000"
    />
    <!-- 全局错误弹窗 -->
    <ErrorModal
      :show="!!errorMessage"
      :message="errorMessage"
      @close="bibliometricsStore.error = null"
    />
    
    <!-- 状态监控组件 (开发模式下可见) -->
    <StateMonitor />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBibliometricsStore } from './stores/bibliometricsStore'
// 组件导入
import Navbar from './components/Navbar.vue'
import LoadingModal from './components/LoadingModal.vue'
import ErrorModal from './components/ErrorModal.vue'

const router = useRouter()
const bibliometricsStore = useBibliometricsStore()
/**
 * 只依赖 bibliometricsStore，移除 globalStateManager 相关逻辑
 */

// 计算属性
const isLoading = computed(() => bibliometricsStore.loading)
const errorMessage = computed(() => bibliometricsStore.error)

// 生命周期钩子
onMounted(async () => {
  if (bibliometricsStore.data.length === 0) {
    await bibliometricsStore.loadData()
  }
})
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden; /* 防止水平滚动条 */
}

/* 防止页面跳动 */
html {
  scrollbar-gutter: stable;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-base-300;
}

::-webkit-scrollbar-thumb {
  @apply bg-base-content bg-opacity-20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-base-content bg-opacity-30;
}

/* 表格样式优化 */
.table th {
  @apply bg-base-200 font-semibold;
}

.table td {
  @apply align-middle;
}

/* 卡片阴影优化 */
.card {
  @apply shadow-lg border border-base-300;
}

/* 按钮动画 - 移除scale以防止跳动 */
.btn {
  @apply transition-colors duration-200;
}

.btn:hover {
  @apply opacity-90;
}

/* 图表容器 */
.chart-container {
  @apply bg-base-100 rounded-lg p-4 shadow-md;
}

/* 筛选标签样式 */
.filter-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    @apply px-2;
  }
  
  .card-body {
    @apply p-4;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 统计卡片优化 - 移除scale以防止跳动 */
.stat {
  @apply transition-colors duration-200;
}

.stat:hover {
  @apply bg-base-300;
}

.stat-figure svg {
  @apply transition-colors duration-200;
}

/* 表格行悬停效果 */
.table-hover tbody tr:hover {
  @apply bg-base-200;
}

/* 标签云样式 - 移除scale以防止跳动 */
.tag-cloud .badge {
  @apply m-1 transition-colors duration-200 cursor-pointer;
}

.tag-cloud .badge:hover {
  @apply opacity-80;
}

/* 进度条样式 */
.progress {
  @apply h-2 rounded-full overflow-hidden;
}

/* 工具提示样式 */
.tooltip {
  @apply text-xs;
}

/* 质量评分颜色 */
.quality-score-0 { @apply text-error; }
.quality-score-1 { @apply text-warning; }
.quality-score-2 { @apply text-warning; }
.quality-score-3 { @apply text-info; }
.quality-score-4 { @apply text-info; }
.quality-score-5 { @apply text-success; }
.quality-score-6 { @apply text-success; }
.quality-score-7 { @apply text-success font-bold; }

/* 性能指标颜色 */
.performance-excellent { @apply text-success; }
.performance-good { @apply text-info; }
.performance-fair { @apply text-warning; }
.performance-poor { @apply text-error; }
</style>
