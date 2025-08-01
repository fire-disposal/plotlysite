import { createRouter, createWebHistory } from 'vue-router'

// 导入视图组件
import OverviewView from '../views/OverviewView.vue'
import FilterView from '../views/FilterView.vue'
import ChartsView from '../views/ChartsView.vue'
import FeatureAnalysisView from '../views/FeatureAnalysisView.vue'
import QualityView from '../views/QualityView.vue'
import SimilarityView from '../views/SimilarityView.vue'

const routes = [
  {
    path: '/',
    redirect: '/overview'
  },
  {
    path: '/overview',
    name: 'Overview',
    component: OverviewView,
    meta: {
      title: '数据概览',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
  },
  {
    path: '/filters',
    name: 'Filters',
    component: FilterView,
    meta: {
      title: '多维筛选',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
    }
  },
  {
    path: '/charts',
    name: 'Charts',
    component: ChartsView,
    meta: {
      title: '图表分析',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
  },
  {
    path: '/features',
    name: 'Features',
    component: FeatureAnalysisView,
    meta: {
      title: '特征分析',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: QualityView,
    meta: {
      title: '质量评估',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    }
  },
  {
    path: '/similarity',
    name: 'Similarity',
    component: SimilarityView,
    meta: {
      title: '相似性搜索',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 文献计量学分析平台`
  } else {
    document.title = '文献计量学分析平台'
  }
  next()
})

export default router