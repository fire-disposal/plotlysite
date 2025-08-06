<template>
  <div class="navbar bg-base-100 shadow-lg">
    <!-- 导航栏左侧 - Logo 和标题 -->
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <Bars3Icon class="h-5 w-5" />
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><RouterLink to="/about" class="w-full text-left">{{ t('nav.about') }}</RouterLink></li>
          <li><RouterLink to="/overview" class="w-full text-left">{{ t('nav.overview') }}</RouterLink></li>
          <li><RouterLink to="/filters" class="w-full text-left">{{ t('nav.filters') }}</RouterLink></li>
        </ul>
      </div>
      
      <!-- Logo 和标题 -->
      <div class="flex items-center space-x-2">
        <div class="avatar">
          <div class="w-8 h-8 rounded">
            <AcademicCapIcon class="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 class="text-xl font-bold text-base-content">{{ t('about.title') }}</h1>
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
            {{ t('nav.about') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/overview"
            class="flex items-center gap-2"
          >
            <ChartBarIcon class="h-4 w-4" />
            {{ t('nav.overview') }}
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/filters"
            class="flex items-center gap-2"
          >
            <AdjustmentsHorizontalIcon class="h-4 w-4" />
            {{ t('nav.filters') }}
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
              <div class="stat-title text-xs">{{ t('nav.total') }}</div>
              <div class="stat-value text-sm">{{ totalCount }}</div>
            </div>
            <div class="stat py-2 px-3">
              <div class="stat-title text-xs">{{ t('nav.data_f_count') }}</div>
              <div class="stat-value text-sm">{{ biblio.filteredData?.length ?? 0 }}</div>
            </div>
            <div class="stat py-2 px-3">
              <div class="stat-title text-xs">{{ t('nav.status') }}</div>
              <div class="stat-value text-xs" :class="statusClass">{{ t('nav.' + dataStatus) }}</div>
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

        <!-- 语言切换（地区图标下拉） -->
        <div class="dropdown dropdown-end" :class="{ 'dropdown-open': langDropdownOpen }">
          <label tabindex="0" class="btn btn-ghost btn-sm" aria-label="切换语言" @click="langDropdownOpen = !langDropdownOpen" @keydown.enter.prevent="langDropdownOpen = !langDropdownOpen">
            <GlobeAltIcon class="h-4 w-4" />
          </label>
          <transition name="fade-modal">
            <ul v-if="langDropdownOpen" tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-28" @keydown.esc="langDropdownOpen = false">
              <li>
                <label
                  @click="handleLangSelect('zh')"
                  :class="['lang-select-label flex items-center gap-2', { active: currentLang === 'zh' }]"
                  aria-checked="currentLang === 'zh'"
                  role="menuitemradio"
                  tabindex="0"
                >
                  <span v-if="currentLang === 'zh'" class="text-primary"><svg width="16" height="16" fill="none"><path d="M4 8.5l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                  中文
                </label>
              </li>
              <li>
                <label
                  @click="handleLangSelect('en')"
                  :class="['lang-select-label flex items-center gap-2', { active: currentLang === 'en' }]"
                  aria-checked="currentLang === 'en'"
                  role="menuitemradio"
                  tabindex="0"
                >
                  <span v-if="currentLang === 'en'" class="text-primary"><svg width="16" height="16" fill="none"><path d="M4 8.5l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                  English
                </label>
              </li>
            </ul>
          </transition>
        </div>

        <!-- 主题切换 -->
        <button
          class="btn btn-ghost btn-sm"
          @click="toggleTheme"
          :aria-label="currentTheme === 'dark' ? '切换为浅色主题' : '切换为深色主题'"
        >
          <component :is="currentTheme === 'dark' ? SunIcon : MoonIcon" class="h-4 w-4" />
        </button>
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
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useBiblio } from '../stores/biblioStore'
import { ChartBarIcon, AdjustmentsHorizontalIcon, Bars3Icon, AcademicCapIcon, ArrowPathIcon, MoonIcon, SunIcon, ExclamationTriangleIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const biblio = useBiblio()
const { t, locale } = useI18n()

// 计算属性
const isLoading = computed(() => biblio.loading)
const error = computed(() => biblio.error)
const totalCount = computed(() => biblio.data?.length || 0)

const dataStatus = computed(() => {
  if (isLoading.value) return 'loading'
  if (error.value) return 'error'
  if (totalCount.value > 0) return 'ready'
  return 'nodata'
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

const currentTheme = ref('light')
const currentLang = ref(localStorage.getItem('lang') || 'zh')

// 语言下拉菜单控制
const langDropdownOpen = ref(false)

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  currentTheme.value = theme
}

const toggleTheme = () => {
  const next = currentTheme.value === 'dark' ? 'light' : 'dark'
  setTheme(next)
}

// 切换语言并关闭下拉
const handleLangSelect = (lang) => {
  currentLang.value = lang
  localStorage.setItem('lang', lang)
  locale.value = lang
  langDropdownOpen.value = false
  window.dispatchEvent(new Event('langchange'))
}

// 点击外部关闭下拉
const handleClickOutside = (e) => {
  const dropdown = document.querySelector('.dropdown-end')
  if (dropdown && !dropdown.contains(e.target)) {
    langDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  currentTheme.value = savedTheme
}

// 组件挂载时初始化主题
initTheme()
</script>

<style scoped>
.menu li > a.router-link-active {
  @apply bg-primary text-primary-content;
}
.menu li > a.active {
  @apply bg-primary text-primary-content;
}

.lang-select-label {
  @apply rounded-full px-3 py-1 transition-colors duration-150 cursor-pointer;
  background: transparent;
  color: #6366f1;
  font-weight: 500;
}
.lang-select-label.active {
  background: transparent;
  color: #4f46e5;
  font-weight: 700;
  box-shadow: none;
  text-decoration: underline;
}
.lang-select-label:hover:not(.active) {
  background: transparent;
  color: #6366f1;
  text-decoration: underline;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1);
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

/* 语言下拉动画 */
.dropdown-content {
  transition: opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1);
  opacity: 1;
  transform: translateY(0);
}
.fade-modal-enter-from .dropdown-content,
.fade-modal-leave-to .dropdown-content {
  opacity: 0;
  transform: translateY(-8px);
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