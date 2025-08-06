import { createRouter, createWebHistory } from 'vue-router'

// 导入视图组件
import OverviewView from '../views/OverviewView.vue'
import FilterView from '../views/FilterView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    redirect: '/about'
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: '平台介绍',
      icon: 'AcademicCapIcon'
    }
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