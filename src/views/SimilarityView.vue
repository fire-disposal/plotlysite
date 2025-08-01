<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="hero bg-base-200 rounded-lg py-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">相似性搜索</h1>
          <p class="py-4">基于多维特征找到相似的研究论文，发现研究模式和潜在合作机会。</p>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-if="!hasData" class="alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>请先加载数据以开始相似性搜索</span>
    </div>

    <!-- 搜索控制面板 -->
    <div v-if="hasData" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          搜索设置
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 目标论文选择 -->
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">选择目标论文</span>
              </label>
              <select class="select select-bordered" v-model="selectedPaperId" @change="onPaperSelected">
                <option value="">请选择一篇论文...</option>
                <option v-for="paper in availablePapers" :key="paper.Paper_ID" :value="paper.Paper_ID">
                  {{ paper.title }}
                </option>
              </select>
            </div>
            
            <!-- 选中论文信息 -->
            <div v-if="targetPaper" class="card bg-base-200">
              <div class="card-body p-4">
                <h3 class="font-semibold text-sm">目标论文信息</h3>
                <div class="space-y-2 text-sm">
                  <div><span class="font-medium">网络类型:</span> {{ targetPaper.network_type }}</div>
                  <div><span class="font-medium">癌症类型:</span> {{ targetPaper.cancer_type }}</div>
                  <div><span class="font-medium">AUC:</span> {{ parseFloat(targetPaper.performance_auc).toFixed(3) }}</div>
                  <div><span class="font-medium">质量评分:</span> {{ targetPaper.q_score }}/7</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 搜索参数 -->
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">相似论文数量</span>
                <span class="label-text-alt">{{ similarityCount }}</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="20" 
                v-model="similarityCount" 
                class="range range-primary"
              >
              <div class="w-full flex justify-between text-xs px-2">
                <span>5</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">相似性权重配置</span>
              </label>
              <div class="space-y-2">
                <label class="label cursor-pointer">
                  <span class="label-text">网络架构 ({{ weights.network }}%)</span>
                  <input type="range" min="0" max="100" v-model="weights.network" class="range range-xs range-primary">
                </label>
                <label class="label cursor-pointer">
                  <span class="label-text">癌症类型 ({{ weights.cancer }}%)</span>
                  <input type="range" min="0" max="100" v-model="weights.cancer" class="range range-xs range-secondary">
                </label>
                <label class="label cursor-pointer">
                  <span class="label-text">性能指标 ({{ weights.performance }}%)</span>
                  <input type="range" min="0" max="100" v-model="weights.performance" class="range range-xs range-accent">
                </label>
                <label class="label cursor-pointer">
                  <span class="label-text">质量评分 ({{ weights.quality }}%)</span>
                  <input type="range" min="0" max="100" v-model="weights.quality" class="range range-xs range-info">
                </label>
              </div>
            </div>
            
            <div class="card-actions justify-end">
              <button 
                class="btn btn-primary"
                @click="findSimilarPapers"
                :disabled="!targetPaper || isSearching"
              >
                <span v-if="isSearching" class="loading loading-spinner loading-sm"></span>
                {{ isSearching ? '搜索中...' : '开始搜索' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 相似性结果 -->
    <div v-if="similarPapers.length > 0" class="space-y-6">
      <!-- 相似性分析图表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              相似性分数分布
            </h2>
            <PlotlyChart
              :data="similarityDistributionData"
              :layout="similarityDistributionLayout"
              height="300"
            />
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              性能对比散点图
            </h2>
            <PlotlyChart
              :data="performanceComparisonData"
              :layout="performanceComparisonLayout"
              height="300"
            />
          </div>
        </div>
      </div>

      <!-- 相似论文列表 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            相似论文排名
            <div class="badge badge-primary ml-2">{{ similarPapers.length }} 篇</div>
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="(paper, index) in similarPapers" 
              :key="paper.Paper_ID"
              class="card bg-base-200 hover:bg-base-300 transition-colors duration-200"
            >
              <div class="card-body p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="badge badge-primary">{{ index + 1 }}</div>
                      <div class="badge" :class="getSimilarityClass(paper.similarity)">
                        相似度: {{ (paper.similarity * 100).toFixed(1) }}%
                      </div>
                    </div>
                    
                    <h3 class="font-semibold text-sm mb-2">{{ paper.title }}</h3>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span class="font-medium">网络:</span> 
                        <span class="badge badge-outline badge-xs ml-1">{{ paper.network_type }}</span>
                      </div>
                      <div>
                        <span class="font-medium">癌症:</span> 
                        <span class="text-gray-600">{{ paper.cancer_type }}</span>
                      </div>
                      <div>
                        <span class="font-medium">AUC:</span> 
                        <span class="font-mono">{{ parseFloat(paper.performance_auc).toFixed(3) }}</span>
                      </div>
                      <div>
                        <span class="font-medium">质量:</span> 
                        <span class="badge badge-sm" :class="`quality-score-${paper.q_score}`">
                          {{ paper.q_score }}/7
                        </span>
                      </div>
                    </div>
                    
                    <!-- 相似性详细分析 -->
                    <div class="mt-3">
                      <details class="collapse collapse-arrow bg-base-100">
                        <summary class="collapse-title text-xs font-medium">相似性分析详情</summary>
                        <div class="collapse-content">
                          <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="flex justify-between">
                              <span>网络架构匹配:</span>
                              <span class="font-mono">{{ getNetworkSimilarity(paper).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span>癌症类型匹配:</span>
                              <span class="font-mono">{{ getCancerSimilarity(paper).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span>性能相似性:</span>
                              <span class="font-mono">{{ getPerformanceSimilarity(paper).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span>质量相似性:</span>
                              <span class="font-mono">{{ getQualitySimilarity(paper).toFixed(2) }}</span>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                  
                  <div class="flex flex-col space-y-1">
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="selectAsSeed(paper)"
                      title="作为新的搜索目标"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="comparePapers(paper)"
                      title="详细对比"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6m-6 4h6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分析洞察 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            搜索洞察
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">平均相似度</div>
              <div class="stat-value text-primary">{{ averageSimilarity.toFixed(2) }}</div>
              <div class="stat-desc">相似性分析结果</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">最相似论文</div>
              <div class="stat-value text-success">{{ topSimilarity.toFixed(2) }}</div>
              <div class="stat-desc">最高相似度分数</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">共同特征</div>
              <div class="stat-value text-info">{{ commonFeatures }}</div>
              <div class="stat-desc">主要相似维度</div>
            </div>
          </div>
          
          <div class="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">研究建议</h3>
              <div class="text-sm">{{ researchSuggestion }}</div>
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

const bibliometricsStore = useBibliometricsStore()
const globalStateManager = useGlobalStateStore()

// 页面挂载时确保应用已初始化
onMounted(async () => {
  if (!globalStateManager.state.isInitialized) {
    await globalStateManager.initializeApp()
  }
})

// 响应式数据
const selectedPaperId = ref('')
const similarityCount = ref(10)
const isSearching = ref(false)
const similarPapers = ref([])
const weights = ref({
  network: 25,
  cancer: 25,
  performance: 25,
  quality: 25
})

// 计算属性
const hasData = computed(() => bibliometricsStore.data.length > 0)
const filteredData = computed(() => bibliometricsStore.filteredData)

const availablePapers = computed(() => {
  return filteredData.value
    .filter(paper => !isNaN(parseFloat(paper.performance_auc)))
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 50) // 限制选项数量以提升性能
})

const targetPaper = computed(() => {
  return filteredData.value.find(paper => paper.Paper_ID.toString() === selectedPaperId.value)
})

const similarityDistributionData = computed(() => {
  if (similarPapers.value.length === 0) return []
  
  return [{
    x: similarPapers.value.map(p => p.similarity),
    type: 'histogram',
    marker: { color: '#3b82f6' },
    nbinsx: 10,
    name: '相似度分布'
  }]
})

const similarityDistributionLayout = computed(() => ({
  title: '',
  xaxis: { title: '相似度分数' },
  yaxis: { title: '论文数量' },
  margin: { t: 20, r: 20, b: 40, l: 40 }
}))

const performanceComparisonData = computed(() => {
  if (similarPapers.value.length === 0 || !targetPaper.value) return []
  
  const targetAuc = parseFloat(targetPaper.value.performance_auc)
  
  return [
    {
      x: [targetAuc],
      y: [targetPaper.value.q_score],
      type: 'scatter',
      mode: 'markers',
      marker: { color: '#ef4444', size: 12, symbol: 'star' },
      name: '目标论文'
    },
    {
      x: similarPapers.value.map(p => parseFloat(p.performance_auc)),
      y: similarPapers.value.map(p => p.q_score),
      type: 'scatter',
      mode: 'markers',
      marker: { 
        color: similarPapers.value.map(p => p.similarity),
        colorscale: 'Viridis',
        size: 8,
        showscale: true,
        colorbar: { title: '相似度' }
      },
      name: '相似论文'
    }
  ]
})

const performanceComparisonLayout = computed(() => ({
  title: '',
  xaxis: { title: 'AUC 性能' },
  yaxis: { title: '质量评分' },
  margin: { t: 20, r: 20, b: 40, l: 40 }
}))

const averageSimilarity = computed(() => {
  if (similarPapers.value.length === 0) return 0
  return similarPapers.value.reduce((sum, p) => sum + p.similarity, 0) / similarPapers.value.length
})

const topSimilarity = computed(() => {
  if (similarPapers.value.length === 0) return 0
  return Math.max(...similarPapers.value.map(p => p.similarity))
})

const commonFeatures = computed(() => {
  if (similarPapers.value.length === 0 || !targetPaper.value) return 'N/A'
  
  const networkMatch = similarPapers.value.filter(p => p.network_type === targetPaper.value.network_type).length
  const cancerMatch = similarPapers.value.filter(p => {
    if (!p.cancer_type || !targetPaper.value.cancer_type) return false
    const targetCancers = targetPaper.value.cancer_type.split(',').map(c => c.trim())
    const paperCancers = p.cancer_type.split(',').map(c => c.trim())
    return targetCancers.some(tc => paperCancers.includes(tc))
  }).length
  
  if (networkMatch > cancerMatch) {
    return '网络架构'
  } else if (cancerMatch > networkMatch) {
    return '癌症类型'
  } else {
    return '综合特征'
  }
})

const researchSuggestion = computed(() => {
  if (similarPapers.value.length === 0) return ''
  
  const avgSimilarity = averageSimilarity.value
  
  if (avgSimilarity > 0.8) {
    return '发现了高度相似的研究群体，建议深入分析这些研究的方法学差异和创新点，寻找潜在的合作机会。'
  } else if (avgSimilarity > 0.6) {
    return '找到了一些相似的研究，建议对比分析不同方法的优缺点，为后续研究提供参考。'
  } else {
    return '相似度较低，说明该研究具有较强的独特性，建议关注其创新方法和应用价值。'
  }
})

// 方法
const onPaperSelected = () => {
  similarPapers.value = []
}

const findSimilarPapers = async () => {
  if (!targetPaper.value) return
  
  isSearching.value = true
  
  try {
    // 模拟搜索过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用自定义权重计算相似性
    const results = calculateWeightedSimilarity(targetPaper.value, parseInt(similarityCount.value))
    similarPapers.value = results
    
  } catch (error) {
    console.error('搜索失败:', error)
    alert('搜索过程中出现错误，请重试')
  } finally {
    isSearching.value = false
  }
}

const calculateWeightedSimilarity = (target, k) => {
  const candidates = filteredData.value.filter(paper => 
    paper.Paper_ID !== target.Paper_ID
  )
  
  const similarities = candidates.map(paper => {
    let similarity = 0
    let totalWeight = 0
    
    // 网络架构相似性
    if (weights.value.network > 0) {
      const networkSim = paper.network_type === target.network_type ? 1 : 0
      similarity += networkSim * (weights.value.network / 100)
      totalWeight += weights.value.network / 100
    }
    
    // 癌症类型相似性
    if (weights.value.cancer > 0 && paper.cancer_type && target.cancer_type) {
      const cancers1 = target.cancer_type.split(',').map(c => c.trim())
      const cancers2 = paper.cancer_type.split(',').map(c => c.trim())
      const intersection = cancers1.filter(c => cancers2.includes(c))
      const cancerSim = intersection.length / Math.max(cancers1.length, cancers2.length)
      similarity += cancerSim * (weights.value.cancer / 100)
      totalWeight += weights.value.cancer / 100
    }
    
    // 性能相似性
    if (weights.value.performance > 0) {
      const auc1 = parseFloat(target.performance_auc)
      const auc2 = parseFloat(paper.performance_auc)
      if (!isNaN(auc1) && !isNaN(auc2)) {
        const perfSim = 1 - Math.abs(auc1 - auc2)
        similarity += Math.max(0, perfSim) * (weights.value.performance / 100)
        totalWeight += weights.value.performance / 100
      }
    }
    
    // 质量相似性
    if (weights.value.quality > 0) {
      const scoreDiff = Math.abs((target.q_score || 0) - (paper.q_score || 0))
      const qualitySim = 1 - (scoreDiff / 7)
      similarity += Math.max(0, qualitySim) * (weights.value.quality / 100)
      totalWeight += weights.value.quality / 100
    }
    
    return {
      ...paper,
      similarity: totalWeight > 0 ? similarity / totalWeight : 0
    }
  })
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k)
}

const getSimilarityClass = (similarity) => {
  if (similarity >= 0.8) return 'badge-success'
  if (similarity >= 0.6) return 'badge-info'
  if (similarity >= 0.4) return 'badge-warning'
  return 'badge-error'
}

const getNetworkSimilarity = (paper) => {
  return targetPaper.value && paper.network_type === targetPaper.value.network_type ? 1.0 : 0.0
}

const getCancerSimilarity = (paper) => {
  if (!targetPaper.value || !paper.cancer_type || !targetPaper.value.cancer_type) return 0.0
  
  const cancers1 = targetPaper.value.cancer_type.split(',').map(c => c.trim())
  const cancers2 = paper.cancer_type.split(',').map(c => c.trim())
  const intersection = cancers1.filter(c => cancers2.includes(c))
  
  return intersection.length / Math.max(cancers1.length, cancers2.length)
}

const getPerformanceSimilarity = (paper) => {
  if (!targetPaper.value) return 0.0
  
  const auc1 = parseFloat(targetPaper.value.performance_auc)
  const auc2 = parseFloat(paper.performance_auc)
  
  if (isNaN(auc1) || isNaN(auc2)) return 0.0
  
  return Math.max(0, 1 - Math.abs(auc1 - auc2))
}

const getQualitySimilarity = (paper) => {
  if (!targetPaper.value) return 0.0
  
  const scoreDiff = Math.abs((targetPaper.value.q_score || 0) - (paper.q_score || 0))
  return Math.max(0, 1 - (scoreDiff / 7))
}

const selectAsSeed = (paper) => {
  selectedPaperId.value = paper.Paper_ID.toString()
  similarPapers.value = []
}

const comparePapers = (paper) => {
  // 可以实现详细对比功能
  console.log('对比论文:', paper.title)
}

// 监听选中的论文变化
watch(() => bibliometricsStore.selectedPaper, (newPaper) => {
  if (newPaper) {
    selectedPaperId.value = newPaper.Paper_ID.toString()
  }
})
</script>