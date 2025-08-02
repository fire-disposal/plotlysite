<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="hero bg-base-200 rounded-lg py-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">特征重要性分析</h1>
          <p class="py-4">基于机器学习算法识别影响研究性能的关键特征，为研究设计提供指导。</p>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-if="!hasData" class="alert alert-warning">
      <ExclamationTriangleIcon class="shrink-0 h-6 w-6 text-warning" />
      <span>请先加载数据以开始特征分析</span>
    </div>

    <!-- 特征分析区域 -->
    <div v-if="hasData" class="space-y-6">
      <!-- 分析控制面板 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Cog6ToothIcon class="h-6 w-6" />
            分析设置
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">目标指标</span>
              </label>
              <select class="select select-bordered" v-model="targetMetric">
                <option value="performance_auc">AUC 性能</option>
                <option value="q_score">质量评分</option>
                <option value="performance_accuracy">准确率</option>
                <option value="performance_sensitivity (recall)">敏感性</option>
                <option value="performance_specificity">特异性</option>
              </select>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">分析方法</span>
              </label>
              <select class="select select-bordered" v-model="analysisMethod">
                <option value="correlation">相关性分析</option>
                <option value="regression">回归分析</option>
                <option value="mutual_info">互信息</option>
              </select>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">特征数量</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="20" 
                v-model="topFeatures" 
                class="range range-primary"
              >
              <div class="w-full flex justify-between text-xs px-2">
                <span>5</span>
                <span>{{ topFeatures }}</span>
                <span>20</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions justify-end">
            <button 
              class="btn btn-primary"
              @click="runAnalysis"
              :disabled="isAnalyzing"
            >
              <span v-if="isAnalyzing" class="loading loading-spinner loading-sm"></span>
              {{ isAnalyzing ? '分析中...' : '开始分析' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 特征重要性结果 -->
      <div v-if="featureImportance && Object.keys(featureImportance).length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 特征重要性图表 -->
        <PlotlyChart
          :data="featureImportanceData"
          :layout="featureImportanceLayout"
          height="400"
          title="特征重要性排名"
        >
          <template #icon>
            <ChartBarIcon class="h-6 w-6" />
          </template>
        </PlotlyChart>

        <!-- 特征重要性表格 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <DocumentChartBarIcon class="h-6 w-6" />
              详细结果
            </h2>
            
            <div class="overflow-x-auto">
              <table class="table table-zebra table-compact">
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>特征名称</th>
                    <th>重要性分数</th>
                    <th>影响类型</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(feature, index) in sortedFeatures" :key="feature.name">
                    <td>
                      <div class="badge badge-primary">{{ index + 1 }}</div>
                    </td>
                    <td class="font-medium">{{ getFeatureDisplayName(feature.name) }}</td>
                    <td>
                      <div class="flex items-center space-x-2">
                        <progress 
                          class="progress progress-primary w-16" 
                          :value="Math.abs(feature.importance)" 
                          max="1"
                        ></progress>
                        <span class="text-sm font-mono">{{ feature.importance.toFixed(3) }}</span>
                      </div>
                    </td>
                    <td>
                      <div 
                        class="badge"
                        :class="feature.importance > 0 ? 'badge-success' : 'badge-error'"
                      >
                        {{ feature.importance > 0 ? '正向' : '负向' }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 特征相关性矩阵 -->
      <PlotlyChart
        v-if="correlationMatrix"
        :data="correlationData"
        :layout="correlationLayout"
        height="500"
        title="特征相关性热力图"
      >
        <template #icon>
          <HeartIcon class="h-6 w-6" />
        </template>
      </PlotlyChart>

      <!-- 分析洞察 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <SunIcon class="h-6 w-6" />
            分析洞察
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="alert alert-info">
              <ChartBarIcon class="shrink-0 w-6 h-6 text-info" />
              <div>
                <h3 class="font-bold">关键发现</h3>
                <div class="text-sm">{{ keyInsight }}</div>
              </div>
            </div>
            
            <div class="alert alert-success">
              <ArrowTrendingUpIcon class="shrink-0 h-6 w-6 text-success" />
              <div>
                <h3 class="font-bold">研究建议</h3>
                <div class="text-sm">{{ recommendation }}</div>
              </div>
            </div>
          </div>
          
          <div class="stats stats-horizontal shadow mt-4">
            <div class="stat">
              <div class="stat-title">最重要特征</div>
              <div class="stat-value text-primary text-lg">{{ topFeatureName }}</div>
              <div class="stat-desc">重要性: {{ topFeatureScore }}</div>
            </div>
            
            <div class="stat">
              <div class="stat-title">正向特征数</div>
              <div class="stat-value text-success">{{ positiveFeatures }}</div>
              <div class="stat-desc">促进性能提升</div>
            </div>
            
            <div class="stat">
              <div class="stat-title">负向特征数</div>
              <div class="stat-value text-error">{{ negativeFeatures }}</div>
              <div class="stat-desc">可能影响性能</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useBibliometricsStore } from '../stores/bibliometricsStore'
import { useGlobalStateStore } from '../stores/globalStateManager'
import PlotlyChart from '../components/PlotlyChart.vue'
import {
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  HeartIcon,
  SunIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

const bibliometricsStore = useBibliometricsStore()
const globalStateManager = useGlobalStateStore()

// 页面挂载时确保应用已初始化
onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp()
  }
})

// 响应式数据
const targetMetric = ref('performance_auc')
const analysisMethod = ref('correlation')
const topFeatures = ref(10)
const isAnalyzing = ref(false)
const featureImportance = ref({})
const correlationMatrix = ref(null)

// 计算属性
const hasData = computed(() => bibliometricsStore.data.length > 0)
const filteredData = computed(() => bibliometricsStore.filteredData)

const sortedFeatures = computed(() => {
  return Object.entries(featureImportance.value)
    .map(([name, importance]) => ({ name, importance }))
    .sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance))
    .slice(0, parseInt(topFeatures.value))
})

// 图表数据 - 简化版本
const featureImportanceData = computed(() => {
  if (sortedFeatures.value.length === 0) return []
  
  return [{
    x: sortedFeatures.value.map(f => Math.abs(f.importance)),
    y: sortedFeatures.value.map(f => getFeatureDisplayName(f.name)),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: sortedFeatures.value.map(f => f.importance > 0 ? '#10b981' : '#ef4444')
    },
    text: sortedFeatures.value.map(f => f.importance.toFixed(3)),
    textposition: 'auto'
  }]
})

const featureImportanceLayout = computed(() => ({
  title: '',
  xaxis: { title: '重要性分数' },
  yaxis: { title: '', type: 'category' },
  margin: { t: 20, r: 20, b: 40, l: 150 }
}))

const correlationData = computed(() => {
  if (!correlationMatrix.value) return []
  
  const features = Object.keys(correlationMatrix.value)
  const values = features.map(f1 =>
    features.map(f2 => correlationMatrix.value[f1][f2] || 0)
  )
  
  return [{
    z: values,
    x: features.map(getFeatureDisplayName),
    y: features.map(getFeatureDisplayName),
    type: 'heatmap',
    colorscale: 'RdBu',
    zmid: 0,
    showscale: true
  }]
})

const correlationLayout = computed(() => ({
  title: '',
  xaxis: { tickangle: -45 },
  yaxis: { tickangle: 0 },
  margin: { t: 20, r: 20, b: 100, l: 100 }
}))

// 分析洞察 - 使用简化逻辑
const keyInsight = computed(() => {
  if (sortedFeatures.value.length === 0) return '暂无分析结果'
  
  const topFeature = sortedFeatures.value[0]
  const featureName = getFeatureDisplayName(topFeature.name)
  const impact = topFeature.importance > 0 ? '正向影响' : '负向影响'
  
  return `${featureName} 是影响 ${getMetricDisplayName(targetMetric.value)} 的最重要因素，对结果产生${impact}，重要性分数为 ${Math.abs(topFeature.importance).toFixed(3)}。`
})

const recommendation = computed(() => {
  const positiveCount = sortedFeatures.value.filter(f => f.importance > 0).length
  const negativeCount = sortedFeatures.value.filter(f => f.importance < 0).length
  
  if (positiveCount > negativeCount) {
    return '建议研究者重点关注正向特征的优化，这些因素有助于提升研究质量和性能表现。'
  } else {
    return '需要注意负向影响因素，建议在研究设计中避免或缓解这些问题以提升整体表现。'
  }
})

const topFeatureName = computed(() => {
  return sortedFeatures.value.length > 0 ?
    getFeatureDisplayName(sortedFeatures.value[0].name) : 'N/A'
})

const topFeatureScore = computed(() => {
  return sortedFeatures.value.length > 0 ?
    Math.abs(sortedFeatures.value[0].importance).toFixed(3) : '0'
})

const positiveFeatures = computed(() => {
  return sortedFeatures.value.filter(f => f.importance > 0).length
})

const negativeFeatures = computed(() => {
  return sortedFeatures.value.filter(f => f.importance < 0).length
})

// 方法 - 使用store中的计算方法
const runAnalysis = async () => {
  if (filteredData.value.length < 10) {
    alert('数据量不足，需要至少10条记录进行分析')
    return
  }
  
  isAnalyzing.value = true
  
  try {
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 使用 store 中的特征重要性计算方法
    featureImportance.value = bibliometricsStore.calculateFeatureImportance(targetMetric.value)
    
    // 计算相关性矩阵 - 使用统计服务
    calculateCorrelationMatrix()
    
  } catch (error) {
    console.error('分析失败:', error)
    alert('分析过程中出现错误，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

const calculateCorrelationMatrix = () => {
  const numericalFeatures = [
    'DataSize_all',
    'q_score',
    'performance_auc',
    'performance_sensitivity (recall)',
    'performance_specificity'
  ]
  
  const matrix = {}
  

}

// 工具方法
const getFeatureDisplayName = (featureName) => {
  const displayNames = {
    'DataSize_all': '数据集大小',
    'q_score': '质量评分',
    'performance_auc': 'AUC 性能',
    'performance_sensitivity (recall)': '敏感性',
    'performance_specificity': '特异性',
    'performance_accuracy': '准确率',
    'performance_precision (PPV)': '精确率',
    'performance_F1': 'F1 分数',
    'external_val_set': '外部验证',
    'raw_data_availability': '数据可用性',
    'code_availability': '代码可用性',
    'methodological': '方法学完整性'
  }
  
  return displayNames[featureName] || featureName
}

const getMetricDisplayName = (metric) => {
  const displayNames = {
    'performance_auc': 'AUC 性能',
    'q_score': '质量评分',
    'performance_accuracy': '准确率',
    'performance_sensitivity (recall)': '敏感性',
    'performance_specificity': '特异性'
  }
  
  return displayNames[metric] || metric
}

// 监听数据变化，自动运行分析
watch(() => filteredData.value.length, (newLength) => {
  if (newLength >= 10 && Object.keys(featureImportance.value).length === 0) {
    runAnalysis()
  }
})
</script>