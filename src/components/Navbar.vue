<template>
  <div class="navbar bg-base-100 shadow-lg">
    <!-- 导航栏左侧 - Logo 和标题 -->
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><RouterLink to="/overview" class="w-full text-left">数据概览</RouterLink></li>
          <li><RouterLink to="/filters" class="w-full text-left">多维筛选</RouterLink></li>
          <li><RouterLink to="/charts" class="w-full text-left">图表分析</RouterLink></li>
          <li><RouterLink to="/features" class="w-full text-left">特征分析</RouterLink></li>
          <li><RouterLink to="/quality" class="w-full text-left">质量评估</RouterLink></li>
          <li><RouterLink to="/similarity" class="w-full text-left">相似性搜索</RouterLink></li>
        </ul>
      </div>
      
      <!-- Logo 和标题 -->
      <div class="flex items-center space-x-2">
        <div class="avatar">
          <div class="w-8 h-8 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S9.5 8.83 9.5 8zm7 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-xl font-bold text-base-content">文献计量学分析平台</h1>
      </div>
    </div>

    <!-- 导航栏中间 - 主要导航链接 (桌面端) -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <RouterLink
            to="/overview"
            class="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            数据概览
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/filters"
            class="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            多维筛选
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/charts"
            class="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            图表分析
          </RouterLink>
        </li>
        <li>
          <div class="dropdown dropdown-bottom">
            <button tabindex="0" role="button" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              高级分析
            </button>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
              <li><RouterLink to="/features" class="w-full text-left">特征重要性</RouterLink></li>
              <li><RouterLink to="/quality" class="w-full text-left">质量评估</RouterLink></li>
              <li><RouterLink to="/similarity" class="w-full text-left">相似性搜索</RouterLink></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <!-- 导航栏右侧 - 数据状态和操作 -->
    <div class="navbar-end">
      <div class="flex items-center space-x-2">
        <!-- 数据状态指示器 -->
        <div class="flex items-center space-x-1">
          <div class="stats stats-horizontal shadow bg-base-200">
            <div class="stat py-2 px-3">
              <div class="stat-title text-xs">数据总量</div>
              <div class="stat-value text-sm">{{ totalCount }}</div>
            </div>
            <div class="stat py-2 px-3">
              <div class="stat-title text-xs">状态</div>
              <div class="stat-value text-xs" :class="statusClass">{{ dataStatus }}</div>
            </div>
          </div>
        </div>

        <!-- 重新加载数据 -->
        <button 
          class="btn btn-ghost btn-sm"
          @click="reloadData"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <!-- 主题切换 -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a @click="setTheme('light')">浅色主题</a></li>
            <li><a @click="setTheme('dark')">深色主题</a></li>
            <li><a @click="setTheme('cupcake')">Cupcake</a></li>
            <li><a @click="setTheme('bumblebee')">Bumblebee</a></li>
            <li><a @click="setTheme('emerald')">Emerald</a></li>
            <li><a @click="setTheme('corporate')">Corporate</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载状态提示 -->
  <Transition name="fade-modal">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-base-200 bg-opacity-40">
      <div class="flex items-center gap-3 bg-base-100 rounded-xl shadow-lg px-8 py-5 border border-base-300 animate-fade-in">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <span class="text-lg font-medium text-base-content">正在加载数据...</span>
      </div>
    </div>
  </Transition>

  <!-- 错误状态提示 -->
  <div v-if="error" class="alert alert-error shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    <span>{{ error }}</span>
    <div>
      <button class="btn btn-sm btn-outline" @click="clearError">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBibliometricsStore } from '../stores/bibliometricsStore'

const bibliometricsStore = useBibliometricsStore()

// 计算属性
const isLoading = computed(() => bibliometricsStore.loading)
const error = computed(() => bibliometricsStore.error)
const totalCount = computed(() => bibliometricsStore.data?.length || 0)

const dataStatus = computed(() => {
  if (isLoading.value) return '加载中'
  if (error.value) return '错误'
  if (totalCount.value > 0) return '就绪'
  return '无数据'
})

const statusClass = computed(() => {
  if (isLoading.value) return 'text-warning'
  if (error.value) return 'text-error'
  if (totalCount.value > 0) return 'text-success'
  return 'text-base-content'
})

// 方法
const reloadData = async () => {
  await bibliometricsStore.loadData()
}

const clearError = () => {
  bibliometricsStore.error = null
}

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

// 组件挂载时初始化主题
initTheme()
</script>

<style scoped>
.menu li > a.router-link-active {
  @apply bg-primary text-primary-content;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1);
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

.stats {
  @apply text-xs;
}

.stat-title {
  @apply text-xs opacity-60;
}

.stat-value {
  @apply text-sm font-bold;
}
</style>