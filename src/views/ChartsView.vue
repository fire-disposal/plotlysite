<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="hero bg-base-200 rounded-lg py-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">图表分析</h1>
          <p class="py-4">通过多种图表形式深入分析文献计量学数据，发现研究趋势和模式。</p>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-if="!hasData" class="alert alert-warning">
      <ExclamationTriangleIcon class="shrink-0 h-6 w-6 text-warning" />
      <span>请先加载数据以开始图表分析</span>
    </div>

    <!-- 图表分析区域 -->
    <!-- 图表分析区域 -->
    <div v-if="hasData" class="space-y-8">
      <!-- 性能分布分析 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlotlyChart
          :data="aucDistributionData"
          :layout="aucDistributionLayout"
          height="400"
          title="AUC 性能分布"
        >
          <template #icon>
            <ChartBarIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>

        <PlotlyChart
          :data="qualityDistributionData"
          :layout="qualityDistributionLayout"
          height="400"
          title="质量评分分布"
        >
          <template #icon>
            <StarIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>
      </div>
      <!-- 网络类型性能比较 -->
      <PlotlyChart
        :data="networkPerformanceData"
        :layout="networkPerformanceLayout"
        height="500"
        title="网络架构性能比较"
      >
        <template #icon>
          <CpuChipIcon class="h-6 w-6" />
        </template>
      </PlotlyChart>

      <!-- 时间趋势分析 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlotlyChart
          :data="yearlyTrendData"
          :layout="yearlyTrendLayout"
          height="400"
          title="年度发表趋势"
        >
          <template #icon>
            <ChartPieIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>

        <PlotlyChart
          :data="performanceTrendData"
          :layout="performanceTrendLayout"
          height="400"
          title="性能提升趋势"
        >
          <template #icon>
            <BoltIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>
      </div>

      <!-- 癌症类型分析 -->
      <PlotlyChart
        :data="cancerAnalysisData"
        :layout="cancerAnalysisLayout"
        height="600"
        title="癌症类型研究热度与性能分析"
      >
        <template #icon>
          <SunIcon class="h-6 w-6" />
        </template>
      </PlotlyChart>

      <!-- 相关性分析 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlotlyChart
          :data="qualityVsPerformanceData"
          :layout="qualityVsPerformanceLayout"
          height="400"
          title="质量评分 vs AUC 性能"
        >
          <template #icon>
            <ArrowTrendingUpIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>

        <PlotlyChart
          :data="dataOpenImpactData"
          :layout="dataOpenImpactLayout"
          height="400"
          title="数据开放性影响"
        >
          <template #icon>
            <HeartIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>
      </div>

      <!-- 统计摘要 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <DocumentChartBarIcon class="h-6 w-6" />
            关键洞察
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">最高 AUC</div>
              <div class="stat-value text-success">{{ topPerformance.toFixed(3) }}</div>
              <div class="stat-desc">{{ topPerformanceNetwork }}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">最受关注癌症</div>
              <div class="stat-value text-primary">{{ mostStudiedCancer }}</div>
              <div class="stat-desc">{{ mostStudiedCancerCount }} 篇研究</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">最流行网络</div>
              <div class="stat-value text-secondary">{{ mostPopularNetwork }}</div>
              <div class="stat-desc">{{ mostPopularNetworkCount }} 篇使用</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">数据开放率</div>
              <div class="stat-value text-info">{{ dataOpenRate }}%</div>
              <div class="stat-desc">{{ dataOpenCount }}/{{ totalPapers }} 篇</div>
            </div>
          </div>
          
          <div class="alert alert-info mt-4">
            <ChartBarIcon class="shrink-0 w-6 h-6 text-info" />
            <div>
              <h3 class="font-bold">研究趋势分析</h3>
              <div class="text-sm">{{ trendInsight }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBibliometricsStore } from '../stores/bibliometricsStore'
import { useGlobalStateStore } from '../stores/globalStateManager'
import PlotlyChart from '../components/PlotlyChart.vue'
import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  StarIcon,
  CpuChipIcon,
  ChartPieIcon,
  BoltIcon,
  SunIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'

const bibliometricsStore = useBibliometricsStore()
const globalStateManager = useGlobalStateStore()

// 基础计算属性
const hasData = computed(() => bibliometricsStore.data.length > 0)
const filteredData = computed(() => bibliometricsStore.filteredData)
const totalPapers = computed(() => filteredData.value.length)

// 页面挂载时确保应用已初始化并预热缓存
onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp()
  }
  // 预热图表数据缓存
  if (hasData.value) {
    await bibliometricsStore.warmupCache()
  }
})

// 图表数据 - 使用统一的图表数据服务
const aucDistributionChart = computed(() =>
  bibliometricsStore.generateChartData('aucDistribution')
)
const aucDistributionData = computed(() => aucDistributionChart.value.data)
const aucDistributionLayout = computed(() => aucDistributionChart.value.layout)

const qualityDistributionChart = computed(() =>
  bibliometricsStore.generateChartData('qualityDistribution')
)
const qualityDistributionData = computed(() => qualityDistributionChart.value.data)
const qualityDistributionLayout = computed(() => qualityDistributionChart.value.layout)

const networkPerformanceChart = computed(() =>
  bibliometricsStore.generateChartData('networkPerformance')
)
const networkPerformanceData = computed(() => networkPerformanceChart.value.data)
const networkPerformanceLayout = computed(() => networkPerformanceChart.value.layout)

const yearlyTrendChart = computed(() =>
  bibliometricsStore.generateChartData('yearlyTrend')
)
const yearlyTrendData = computed(() => yearlyTrendChart.value.data)
const yearlyTrendLayout = computed(() => yearlyTrendChart.value.layout)

const performanceTrendChart = computed(() =>
  bibliometricsStore.generateChartData('performanceTrend')
)
const performanceTrendData = computed(() => performanceTrendChart.value.data)
const performanceTrendLayout = computed(() => performanceTrendChart.value.layout)

const qualityVsPerformanceChart = computed(() =>
  bibliometricsStore.generateChartData('qualityVsPerformance')
)
const qualityVsPerformanceData = computed(() => qualityVsPerformanceChart.value.data)
const qualityVsPerformanceLayout = computed(() => qualityVsPerformanceChart.value.layout)

// 癌症类型分析 - 使用分析服务的高级功能
const cancerAnalysisResult = computed(() => {
  if (!hasData.value) return { data: [], layout: {}, insights: {} }
  // 这里可以直接调用分析服务的癌症分析功能
  // 暂时保持原有逻辑，但数据来源更清晰
  const stats = bibliometricsStore.statistics
  const cancerStats = stats.cancerTypes || { categories: [], counts: [] }
  
  // 简化的癌症分析数据
  return {
    data: [{
      x: cancerStats.categories.slice(0, 15),
      y: cancerStats.counts.slice(0, 15),
      type: 'bar',
      marker: { color: '#10b981' }
    }],
    layout: {
      title: '',
      xaxis: { title: '癌症类型' },
      yaxis: { title: '研究数量' },
      margin: { t: 20, r: 20, b: 80, l: 40 }
    }
  }
})
const cancerAnalysisData = computed(() => cancerAnalysisResult.value.data)
const cancerAnalysisLayout = computed(() => cancerAnalysisResult.value.layout)

// 数据开放性影响 - 简化版本
const dataOpenImpactData = computed(() => {
  const openData = []
  const closedData = []
  
  filteredData.value.forEach(paper => {
    const auc = parseFloat(paper.performance_auc)
    if (!isNaN(auc)) {
      if (paper.raw_data_availability === 'yes') {
        openData.push(auc)
      } else {
        closedData.push(auc)
      }
    }
  })
  
  return [
    {
      y: openData,
      type: 'box',
      name: '数据开放',
      marker: { color: '#10b981' }
    },
    {
      y: closedData,
      type: 'box',
      name: '数据不开放',
      marker: { color: '#ef4444' }
    }
  ]
})

const dataOpenImpactLayout = computed(() => ({
  title: '',
  yaxis: { title: 'AUC 性能' },
  margin: { t: 20, r: 20, b: 40, l: 40 }
}))

// 统计摘要 - 使用store中的统计数据
const statistics = computed(() => bibliometricsStore.statistics)
const qualityStats = computed(() => bibliometricsStore.dataAvailabilityStats)

const topPerformance = computed(() => {
  const aucs = filteredData.value
    .map(paper => parseFloat(paper.performance_auc))
    .filter(auc => !isNaN(auc))
  return aucs.length > 0 ? Math.max(...aucs) : 0
})

const topPerformanceNetwork = computed(() => {
  const topPaper = filteredData.value
    .filter(paper => !isNaN(parseFloat(paper.performance_auc)))
    .sort((a, b) => parseFloat(b.performance_auc) - parseFloat(a.performance_auc))[0]
  return topPaper ? topPaper.network_type : 'N/A'
})

const mostStudiedCancer = computed(() => {
  const stats = statistics.value.cancerTypes
  return stats && stats.categories.length > 0 ? stats.categories[0] : 'N/A'
})

const mostStudiedCancerCount = computed(() => {
  const stats = statistics.value.cancerTypes
  return stats && stats.counts.length > 0 ? stats.counts[0] : 0
})

const mostPopularNetwork = computed(() => {
  const stats = statistics.value.networkTypes
  return stats && stats.categories.length > 0 ? stats.categories[0] : 'N/A'
})

const mostPopularNetworkCount = computed(() => {
  const stats = statistics.value.networkTypes
  return stats && stats.counts.length > 0 ? stats.counts[0] : 0
})

const dataOpenRate = computed(() => {
  return qualityStats.value.rawDataAvailable?.percentage || 0
})

const dataOpenCount = computed(() => {
  return qualityStats.value.rawDataAvailable?.count || 0
})

const trendInsight = computed(() => {
  const avgPerformance = statistics.value.performance?.performance_auc?.mean || 0
  
  if (avgPerformance > 0.85) {
    return '近年来深度学习在医学影像领域的性能显著提升，多数研究的AUC超过0.85，表明技术日趋成熟。'
  } else if (avgPerformance > 0.8) {
    return '研究质量稳步提升，平均性能达到良好水平，但仍有优化空间。'
  } else {
    return '领域内研究活跃，但性能表现参差不齐，需要更多高质量研究。'
  }
})
</script>