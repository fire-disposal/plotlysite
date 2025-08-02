<template>
  <div class="p-6 space-y-6 min-h-[400px]">
    <template v-if="store.loading">
      <div class="flex items-center justify-center min-h-[300px]">
        <span class="text-lg text-primary">正在加载数据...</span>
      </div>
    </template>
    <template v-else-if="store.error">
      <div class="flex items-center justify-center min-h-[300px]">
        <span class="text-lg text-error">加载失败：{{ store.error }}</span>
      </div>
    </template>
    <template v-else>
      <div v-if="!hasData" class="hero min-h-[400px] bg-base-200 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-4">文献计量学分析</h1>
          <p class="mb-6">探索和分析医学影像深度学习文献的综合平台。基于文献计量学数据，提供多维度的研究洞察和可视化分析。</p>
          <span class="text-lg text-primary">正在自动加载数据...</span>
        </div>
      </div>
      <div v-else class="space-y-6">
        <!-- 统计区：一列展示（全局store数据） -->
        <div class="flex flex-row gap-4 w-full">
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Total papers" :value="totalCount ?? 0" icon="📄"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Total journals" :value="availableYears?.length ?? 0" icon="📚"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Authors" :value="availableCancerTypes?.length ?? 0" icon="👨‍🔬"/>
          <StatCard class="flex-1 min-w-[140px] border-r last:border-r-0" title="Countries" :value="availableNetworkTypes?.length ?? 0" icon="🌍"/>
          <StatCard class="flex-1 min-w-[140px]" title="Updated on" :value="updatedDate || ''" icon="🕒"/>
        </div>
        <!-- 图表区（全局store数据） -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlotlyChart :data="yearDistData" :layout="yearDistLayout" title="Distribution of papers by year"/>
          <PlotlyChart :data="networkTypeData" :layout="networkTypeLayout" title="Wordcloud for network type"/>
          <PlotlyChart :data="taskDistData" :layout="taskDistLayout" title="Distribution of papers by task"/>
          <PlotlyChart :data="cancerTypeData" :layout="cancerTypeLayout" title="Distribution of papers by cancer type"/>
          <PlotlyChart :data="dataCollectionData" :layout="dataCollectionLayout" title="Distribution of papers by data collection technique"/>
          <PlotlyChart :data="qualityIndexData" :layout="qualityIndexLayout" title="Distribution of papers by quality index"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBibliometricsStore } from '../stores/bibliometricsStore'
import PlotlyChart from '../components/PlotlyChart.vue'
import StatCard from '../components/StatCard.vue'

const store = useBibliometricsStore()

// 基础数据状态
const hasData = computed(() => Array.isArray(store.data) && store.data.length > 0)
const totalCount = computed(() => store.data?.length || 0)
const statistics = computed(() => store.statistics)

// 自动加载数据并预热缓存
import { onActivated } from 'vue'

async function loadAllChartData() {
  if (!hasData.value) return
  try {
    const year = await store.generateChartData('yearDistribution')
    yearDistData.value = year?.data || []
    yearDistLayout.value = year?.layout || {}

    const network = await store.generateChartData('networkTypeDistribution')
    networkTypeData.value = network?.data || []
    networkTypeLayout.value = network?.layout || {}

    const classLabel = await store.generateChartData('classLabelDistribution')
    classLabelData.value = classLabel?.data || []
    classLabelLayout.value = classLabel?.layout || {}

    const task = await store.generateChartData('taskTypeDistribution')
    taskDistData.value = task?.data || []
    taskDistLayout.value = task?.layout || {}

    const cancer = await store.generateChartData('cancerTypeDistribution')
    cancerTypeData.value = cancer?.data || []
    cancerTypeLayout.value = cancer?.layout || {}

    const cancerTask = await store.generateChartData('cancerTypeTaskDistribution')
    cancerTypeTaskData.value = cancerTask?.data || []
    cancerTypeTaskLayout.value = cancerTask?.layout || {}

    const mlTask = await store.generateChartData('mlTaskDistribution')
    mlTaskData.value = mlTask?.data || []
    mlTaskLayout.value = mlTask?.layout || {}

    const dataCollection = await store.generateChartData('dataCollectionTechniqueDistribution')
    dataCollectionData.value = dataCollection?.data || []
    dataCollectionLayout.value = dataCollection?.layout || {}

    const pretrained = await store.generateChartData('pretrainedDatatypeDistribution')
    pretrainedData.value = pretrained?.data || []
    pretrainedLayout.value = pretrained?.layout || {}

    const cohorts = await store.generateChartData('numberOfCohortsDistribution')
    cohortsData.value = cohorts?.data || []
    cohortsLayout.value = cohorts?.layout || {}

    const demographics = await store.generateChartData('demographicsDistribution')
    demographicsData.value = demographics?.data || []
    demographicsLayout.value = demographics?.layout || {}

    const ageRange = await store.generateChartData('ageRangeDistribution')
    ageRangeData.value = ageRange?.data || []
    ageRangeLayout.value = ageRange?.layout || {}

    const dataOrigin = await store.generateChartData('dataOriginDistribution')
    dataOriginData.value = dataOrigin?.data || []
    dataOriginLayout.value = dataOrigin?.layout || {}

    const qualityIndex = await store.generateChartData('qualityIndexDistribution')
    qualityIndexData.value = qualityIndex?.data || []
    qualityIndexLayout.value = qualityIndex?.layout || {}

    const qualityParam = await store.generateChartData('qualityIndexParamDistribution')
    qualityIndexParamData.value = qualityParam?.data || []
    qualityIndexParamLayout.value = qualityParam?.layout || {}
  } catch (e) {
    console.error('图表数据加载失败:', e)
  }
}

import { watch } from 'vue'

onMounted(async () => {
  // 等待全局store加载完成（App.vue已负责加载）
  let retry = 0
  while ((!hasData.value || store.loading) && retry < 20) {
    await new Promise(res => setTimeout(res, 200))
    retry++
  }
  // 若数据依然为空且未在加载，主动触发一次加载
  if (!hasData.value && !store.loading) {
    await store.loadData()
  }
  await loadAllChartData()
})

// 监听数据变化，数据加载后自动刷新图表
watch(() => store.data, async (val) => {
  if (Array.isArray(val) && val.length > 0) {
    await loadAllChartData()
  }
})

// 统计卡片数据 - 使用统计服务的结果
const availableYears = computed(() => statistics.value.years?.length || 0)
const availableCancerTypes = computed(() => statistics.value.cancerTypes?.length || 0)
const availableNetworkTypes = computed(() => statistics.value.networkTypes?.length || 0)

// 图表数据 - 使用统一的图表服务
import { ref } from 'vue'

const yearDistData = ref([])
const yearDistLayout = ref({})
const networkTypeData = ref([])
const networkTypeLayout = ref({})
const classLabelData = ref([])
const classLabelLayout = ref({})
const taskDistData = ref([])
const taskDistLayout = ref([])
const cancerTypeData = ref([])
const cancerTypeLayout = ref([])
const cancerTypeTaskData = ref([])
const cancerTypeTaskLayout = ref([])
const mlTaskData = ref([])
const mlTaskLayout = ref([])
const dataCollectionData = ref([])
const dataCollectionLayout = ref([])
const pretrainedData = ref([])
const pretrainedLayout = ref([])
const cohortsData = ref([])
const cohortsLayout = ref([])
const demographicsData = ref([])
const demographicsLayout = ref([])
const ageRangeData = ref([])
const ageRangeLayout = ref([])
const dataOriginData = ref([])
const dataOriginLayout = ref([])
const qualityIndexData = ref([])
const qualityIndexLayout = ref([])
const qualityIndexParamData = ref([])
const qualityIndexParamLayout = ref([])

// 空数据占位符（用于未实现的图表）
const emptyData = []
const emptyLayout = {}
</script>