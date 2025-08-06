<template>
  <div class="navbar bg-base-100 shadow-lg">
    <!-- 导航栏左侧 - Logo 和标题 -->
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <Bars3Icon class="h-5 w-5" />
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><RouterLink to="/about" class="w-full text-left">平台介绍</RouterLink></li>
          <li><RouterLink to="/overview" class="w-full text-left">数据概览</RouterLink></li>
          <li><RouterLink to="/filters" class="w-full text-left">多维筛选</RouterLink></li>
        </ul>
      </div>
      
      <!-- Logo 和标题 -->
      <div class="flex items-center space-x-2">
        <div class="avatar">
          <div class="w-8 h-8 rounded">
            <AcademicCapIcon class="w-8 h-8 text-primary" />
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
            to="/about"
            class="flex items-center gap-2"
          >
            <AcademicCapIcon class="h-4 w-4" />
            平台介绍
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/overview"
            class="flex items-center gap-2"
          >
            <ChartBarIcon class="h-4 w-4" />
            数据概览
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/filters"
            class="flex items-center gap-2"
          >
            <AdjustmentsHorizontalIcon class="h-4 w-4" />
            多维筛选
          </RouterLink>
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
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </button>

        <!-- 主题切换 -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <MoonIcon class="h-4 w-4" />
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
  <!-- 顶部报错弹窗已移除，统一由全局 ErrorModal 控制 -->
</template>

<script setup>
import { computed } from 'vue'
import { useBiblio } from '../stores/biblioStore'
import { ChartBarIcon, AdjustmentsHorizontalIcon, BoltIcon, Bars3Icon, AcademicCapIcon, ArrowPathIcon, MoonIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const biblio = useBiblio()

// 计算属性
const isLoading = computed(() => biblio.loading)
const error = computed(() => biblio.error)
const totalCount = computed(() => biblio.data?.length || 0)

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
  await biblio.loadData()
}

const clearError = () => {
  biblio.error = null
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