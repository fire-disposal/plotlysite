<template>
  <div class="bg-base-100 border border-base-300 p-6 rounded-lg relative min-h-[400px]">
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="ml-3 text-lg text-primary">正在加载图表数据...</span>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-[400px] text-error text-lg">
      图表加载失败：{{ error }}
    </div>
    <div v-else-if="!hasData" class="flex items-center justify-center min-h-[400px] text-base-content/60 text-lg">
      暂无可视化数据
    </div>
    <div v-else>
      <div v-if="title" class="flex items-center gap-2 text-xl font-semibold mb-4">
        <slot name="icon"></slot>
        <span>{{ title }}</span>
      </div>
      <div :id="chartId" ref="chartContainer" class="w-full h-full min-h-[400px] rounded-lg" style="position:relative;z-index:10;overflow:visible;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed, unref } from 'vue'
import Plotly from 'plotly.js-dist'

const props = defineProps({
  data: { type: [Array, Object], required: true, default: () => [] },
  layout: { type: [Object, Array], default: () => ({}) },
  config: { type: [Object, Array], default: () => ({
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d']
  }) },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: [String, Object], default: null }
})

const chartContainer = ref(null)
const chartId = `smart-plot-${Math.random().toString(36).substr(2, 9)}`

function getUnref(val) {
  return typeof val === 'function' ? val() : unref(val)
}

const hasData = computed(() => {
  const d = getUnref(props.data)
  return Array.isArray(d) && d.length > 0
})

let plotInstance = null

const renderPlot = async () => {
  if (!chartContainer.value || !hasData.value) return
  await nextTick()
  try {
    const data = getUnref(props.data)
    const layout = getUnref(props.layout)
    const config = getUnref(props.config)
    // 调试输出
    console.log('[PlotlyChart] data:', data)
    console.log('[PlotlyChart] layout:', layout)
    console.log('[PlotlyChart] config:', config)
    console.log('[PlotlyChart] chartContainer:', chartContainer.value)
    plotInstance = await Plotly.newPlot(
      chartContainer.value,
      data,
      layout,
      config
    )
  } catch (e) {
    console.error('PlotlyChart 渲染失败:', e)
  }
}

const purgePlot = () => {
  if (plotInstance && chartContainer.value) {
    Plotly.purge(chartContainer.value)
    plotInstance = null
  }
}

let resizeObserver = null
const handleResize = () => {
  if (chartContainer.value) {
    Plotly.Plots.resize(chartContainer.value)
  }
}

watch(
  [() => props.data, () => props.layout],
  async () => {
    if (!hasData.value) {
      purgePlot()
      return
    }
    await renderPlot()
  },
  { deep: false, immediate: true }
)

onMounted(() => {
  renderPlot()
  // 响应式自适应
  resizeObserver = new ResizeObserver(handleResize)
  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  purgePlot()
  if (resizeObserver && chartContainer.value) {
    resizeObserver.unobserve(chartContainer.value)
    resizeObserver = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.loading {
  font-size: 1.5rem;
}
</style>