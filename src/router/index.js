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
      icon: 'ChartBarIcon'
    }
  },
  {
    path: '/filters',
    name: 'Filters',
    component: FilterView,
    meta: {
      title: '多维筛选',
      icon: 'AdjustmentsHorizontalIcon'
    }
  },
  {
    path: '/charts',
    name: 'Charts',
    component: ChartsView,
    meta: {
      title: '图表分析',
      icon: 'ChartBarIcon'
    }
  },
  {
    path: '/features',
    name: 'Features',
    component: FeatureAnalysisView,
    meta: {
      title: '特征分析',
      icon: 'BoltIcon'
    }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: QualityView,
    meta: {
      title: '质量评估',
      icon: 'StarIcon'
    }
  },
  {
    path: '/similarity',
    name: 'Similarity',
    component: SimilarityView,
    meta: {
      title: '相似性搜索',
      icon: 'MagnifyingGlassIcon'
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